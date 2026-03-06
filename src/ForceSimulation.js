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

    this.repulsion = opts.repulsion ?? -120;
    this.linkDistance = opts.linkDistance ?? 50;
    this.linkStrength = opts.linkStrength ?? 0.06;
    this.centerStrength = opts.centerStrength ?? 0.01;
    this.decay = opts.decay ?? 0.92;
    this.alphaMin = opts.alphaMin ?? 0.001;

    this.alpha = 1;

    this._init();
  }

  _init() {
    const spread = 150;
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
