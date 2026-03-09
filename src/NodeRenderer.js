import * as THREE from "three";

/**
 * Creates and manages 3D meshes for graph nodes.
 * Each node gets:
 *   1. A glowing sphere (with emissive colour)
 *   2. A floating multi-line label sprite above the sphere
 */

const LABEL_SCALE = 14;

export class NodeRenderer {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.meshMap = new Map();
    this.labelMap = new Map();
  }

  createNode(node) {
    const baseRadius = (node.size ?? 1) * 3;
    const color = new THREE.Color(node.color ?? "#6366f1");

    const geo = new THREE.SphereGeometry(baseRadius, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.2,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = { nodeId: node.id, baseRadius };
    this.group.add(mesh);
    this.meshMap.set(node.id, mesh);

    const glowGeo = new THREE.SphereGeometry(baseRadius * 1.35, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    mesh.add(glow);

    this._createLabel(node, baseRadius);
  }

  _createLabel(node, radius) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const text = node.label || node.id;
    const lines = text.split("\n");
    const fontSize = 36;
    const lineHeight = fontSize * 1.3;
    const font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;

    ctx.font = font;
    const maxWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));

    const padding = 28;
    canvas.width = nextPow2(maxWidth + padding * 2);
    canvas.height = nextPow2(lines.length * lineHeight + padding * 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const startY =
      canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

    for (let i = 0; i < lines.length; i++) {
      const y = startY + i * lineHeight;

      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillText(lines[i], canvas.width / 2 + 1, y + 1);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(lines[i], canvas.width / 2, y);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(spriteMat);
    const aspect = canvas.width / canvas.height;
    sprite.scale.set(LABEL_SCALE * aspect, LABEL_SCALE, 1);
    sprite.position.y = radius + 6 + lines.length * 2;
    sprite.renderOrder = 1;

    const mesh = this.meshMap.get(node.id);
    mesh.add(sprite);
    this.labelMap.set(node.id, sprite);
  }

  updatePositions(nodes) {
    for (const n of nodes) {
      const mesh = this.meshMap.get(n.id);
      if (mesh) {
        mesh.position.set(n.x, n.y, n.z);
      }
    }
  }

  highlight(nodeId) {
    const mesh = this.meshMap.get(nodeId);
    if (mesh) {
      mesh.material.emissiveIntensity = 0.9;
      mesh.scale.setScalar(1.2);
    }
  }

  unhighlight(nodeId) {
    const mesh = this.meshMap.get(nodeId);
    if (mesh) {
      mesh.material.emissiveIntensity = 0.35;
      mesh.scale.setScalar(1.0);
    }
  }

  getMeshes() {
    return [...this.meshMap.values()];
  }
}

function nextPow2(v) {
  let p = 1;
  while (p < v) p <<= 1;
  return p;
}
