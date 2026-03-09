import * as THREE from "three";

/**
 * Renders edges as semi-transparent lines between reading pairs.
 * Edges are color-coded by the shared connector category.
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

    const edgeColor = edge.connectorColor
      ? new THREE.Color(edge.connectorColor)
      : new THREE.Color(0x4455aa);

    const mat = new THREE.LineBasicMaterial({
      color: edgeColor,
      transparent: true,
      opacity: 0.5,
      linewidth: 1,
    });

    const line = new THREE.Line(geo, mat);
    line.userData = {
      edge,
      baseColor: edgeColor.clone(),
    };
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
        line.material.opacity = 0.7;
        // Brighten the color
        const bright = line.userData.baseColor.clone();
        bright.offsetHSL(0, 0.1, 0.2);
        line.material.color.copy(bright);
      }
    }
  }

  resetHighlight() {
    for (const line of this.lines) {
      line.material.opacity = 0.5;
      line.material.color.copy(line.userData.baseColor);
    }
  }

  dispose() {
    this.scene.remove(this.group);
    for (const line of this.lines) {
      line.geometry.dispose();
      line.material.dispose();
    }
    this.lines = [];
  }
}
