import * as THREE from "three";

/**
 * Renders edges as semi-transparent curved lines between node pairs.
 * Uses THREE.Line with BufferGeometry — positions update each frame.
 */

export class EdgeRenderer {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.lines = [];
  }

  createEdge(edge) {
    const positions = new Float32Array(6);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({
      color: 0x4455aa,
      transparent: true,
      opacity: 0.3,
      linewidth: 1,
    });

    const line = new THREE.Line(geo, mat);
    line.userData = { edge };
    this.group.add(line);
    this.lines.push(line);
  }

  updatePositions(edges) {
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const edge = line.userData.edge;
      const s = edge.sourceNode;
      const t = edge.targetNode;
      if (!s || !t) continue;

      const posAttr = line.geometry.getAttribute("position");
      posAttr.array[0] = s.x;
      posAttr.array[1] = s.y;
      posAttr.array[2] = s.z;
      posAttr.array[3] = t.x;
      posAttr.array[4] = t.y;
      posAttr.array[5] = t.z;
      posAttr.needsUpdate = true;
      line.geometry.computeBoundingSphere();
    }
  }

  highlightEdgesOf(nodeId) {
    for (const line of this.lines) {
      const e = line.userData.edge;
      if (e.source === nodeId || e.target === nodeId) {
        line.material.opacity = 0.8;
        line.material.color.set(0x8899ff);
      }
    }
  }

  resetHighlight() {
    for (const line of this.lines) {
      line.material.opacity = 0.3;
      line.material.color.set(0x4455aa);
    }
  }
}
