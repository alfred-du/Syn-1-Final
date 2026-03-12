/**
 * Minimal 3D force-directed layout engine.
 * Runs a velocity-Verlet integration each tick with:
 *   - many-body repulsion  (charge)
 *   - link spring attraction
 *   - centering force
 *   - velocity decay
 */

export class ForceSimulation {
  constructor(nodes, edges, opts = {}) {
    this.nodes = nodes;
    this.edges = edges;
    this.connectorGroups = opts.connectorGroups ?? []; // [{ connectorId, memberIds: [] }]

    this.repulsion = opts.repulsion ?? -120;
    this.linkDistance = opts.linkDistance ?? 50;
    this.linkStrength = opts.linkStrength ?? 0.06;
    this.centerStrength = opts.centerStrength ?? 0.01;
    this.clusterStrength = opts.clusterStrength ?? 0.015;
    this.similarityStrength = opts.similarityStrength ?? 0.01;
    this.decay = opts.decay ?? 0.92;
    this.alphaMin = opts.alphaMin ?? 0.001;

    this.alpha = 1;

    this._buildSimilarityPairs();
    this._init();
  }

  /**
   * Pre-compute pairwise similarity between all node pairs based on
   * how many connector groups they share. Pairs sharing more connectors
   * get a stronger attraction force.
   */
  _buildSimilarityPairs() {
    this.similarityPairs = [];
    if (!this.connectorGroups.length) return;

    // Build nodeId → set of connectorIds
    const nodeMembership = new Map();
    for (const group of this.connectorGroups) {
      for (const memberId of group.memberIds) {
        if (!nodeMembership.has(memberId)) nodeMembership.set(memberId, new Set());
        nodeMembership.get(memberId).add(group.connectorId);
      }
    }

    // Find max possible shared connectors for normalization
    const maxConnectors = this.connectorGroups.length;

    // Compare all pairs
    const nodeIds = [...nodeMembership.keys()];
    for (let i = 0; i < nodeIds.length; i++) {
      for (let j = i + 1; j < nodeIds.length; j++) {
        const aSet = nodeMembership.get(nodeIds[i]);
        const bSet = nodeMembership.get(nodeIds[j]);
        let shared = 0;
        for (const c of aSet) {
          if (bSet.has(c)) shared++;
        }
        if (shared > 0) {
          this.similarityPairs.push({
            aId: nodeIds[i],
            bId: nodeIds[j],
            weight: shared / maxConnectors, // normalized 0..1
          });
        }
      }
    }
  }

  _init() {
    const spread = 300;
    for (const n of this.nodes) {
      n.x = n.x ?? (Math.random() - 0.5) * spread;
      n.y = n.y ?? (Math.random() - 0.5) * spread;
      n.z = n.z ?? (Math.random() - 0.5) * spread;
      n.vx = 0;
      n.vy = 0;
      n.vz = 0;
    }
  }

  tick() {
    if (this.alpha < this.alphaMin) return;

    this._applyManyBody();
    this._applyLinks();
    this._applyClustering();
    this._applySimilarity();
    this._applyCollision();
    this._applyCenter();
    this._integrate();

    this.alpha *= this.decay;
  }

  get isSettled() {
    return this.alpha < this.alphaMin;
  }

  reheat(alpha = 0.3) {
    this.alpha = Math.max(this.alpha, alpha);
  }

  _applyManyBody() {
    const { nodes, repulsion, alpha } = this;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dz = b.z - a.z;
        let dist2 = dx * dx + dy * dy + dz * dz;
        if (dist2 < 1) dist2 = 1;
        const dist = Math.sqrt(dist2);
        const force = (repulsion * alpha) / dist2;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;
        a.vx -= fx;
        a.vy -= fy;
        a.vz -= fz;
        b.vx += fx;
        b.vy += fy;
        b.vz += fz;
      }
    }
  }

  _applyLinks() {
    const { edges, linkDistance, linkStrength, alpha } = this;
    for (const e of edges) {
      const s = e.sourceNode;
      const t = e.targetNode;
      if (!s || !t) continue;
      let dx = t.x - s.x;
      let dy = t.y - s.y;
      let dz = t.z - s.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const displacement = (dist - linkDistance) * linkStrength * alpha;
      const fx = (dx / dist) * displacement;
      const fy = (dy / dist) * displacement;
      const fz = (dz / dist) * displacement;
      s.vx += fx;
      s.vy += fy;
      s.vz += fz;
      t.vx -= fx;
      t.vy -= fy;
      t.vz -= fz;
    }
  }

  _applyCenter() {
    const { nodes, centerStrength, alpha } = this;
    for (const n of nodes) {
      n.vx -= n.x * centerStrength * alpha;
      n.vy -= n.y * centerStrength * alpha;
      n.vz -= n.z * centerStrength * alpha;
    }
  }

  _applyClustering() {
    const { nodes, connectorGroups, clusterStrength, alpha } = this;
    if (!connectorGroups.length) return;

    const nodeMap = new Map(nodes.map((n) => [n.id, n]));

    for (const group of connectorGroups) {
      const members = group.memberIds
        .map((id) => nodeMap.get(id))
        .filter(Boolean);
      if (members.length < 2) continue;

      // Compute centroid of this connector group
      let cx = 0, cy = 0, cz = 0;
      for (const m of members) { cx += m.x; cy += m.y; cz += m.z; }
      cx /= members.length;
      cy /= members.length;
      cz /= members.length;

      // Pull each member toward centroid
      for (const m of members) {
        m.vx += (cx - m.x) * clusterStrength * alpha;
        m.vy += (cy - m.y) * clusterStrength * alpha;
        m.vz += (cz - m.z) * clusterStrength * alpha;
      }
    }
  }

  /**
   * Pull node pairs together proportionally to how many connectors they share.
   * Nodes sharing 3/6 connectors get 3× the pull of nodes sharing 1/6.
   */
  _applySimilarity() {
    const { similarityPairs, similarityStrength, alpha } = this;
    if (!similarityPairs.length) return;

    const nodeMap = new Map(this.nodes.map((n) => [n.id, n]));

    for (const pair of similarityPairs) {
      const a = nodeMap.get(pair.aId);
      const b = nodeMap.get(pair.bId);
      if (!a || !b) continue;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

      // Strength scales with shared connector count (weight)
      const force = pair.weight * similarityStrength * alpha;
      const fx = dx * force;
      const fy = dy * force;
      const fz = dz * force;

      a.vx += fx;
      a.vy += fy;
      a.vz += fz;
      b.vx -= fx;
      b.vy -= fy;
      b.vz -= fz;
    }
  }

  /**
   * Prevent node overlap by pushing apart nodes whose spheres intersect.
   * Uses node.size to derive radius; always runs (not alpha-scaled)
   * so nodes never visually overlap even after the sim settles.
   */
  _applyCollision() {
    const { nodes } = this;
    // Account for sphere + label + glow clearance (labels are ~14 units tall)
    const labelClearance = 18;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;

        const rA = (a.size ?? 1) * 3 + labelClearance;
        const rB = (b.size ?? 1) * 3 + labelClearance;
        const minDist = rA + rB;

        if (dist < minDist) {
          const overlap = (minDist - dist) / dist * 0.5;
          const ox = dx * overlap;
          const oy = dy * overlap;
          const oz = dz * overlap;
          a.vx -= ox;
          a.vy -= oy;
          a.vz -= oz;
          b.vx += ox;
          b.vy += oy;
          b.vz += oz;
        }
      }
    }
  }

  _integrate() {
    const damping = 0.6;
    for (const n of this.nodes) {
      if (n.pinned) continue;
      n.vx *= damping;
      n.vy *= damping;
      n.vz *= damping;
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;
    }
  }
}
