import * as THREE from "three";

/**
 * Creates and manages 3D meshes for graph nodes.
 * Each node gets:
 *   1. A glowing sphere (with emissive colour)
 *   2. A floating label sprite above the sphere
 *   3. An optional image sprite mapped as a texture
 */

const LABEL_SCALE = 12;
const IMAGE_SPRITE_SIZE = 6;

export class NodeRenderer {
  constructor(scene, textureLoader) {
    this.scene = scene;
    this.loader = textureLoader;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.meshMap = new Map();
    this.labelMap = new Map();
    this.imageMap = new Map();
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

    if (node.image) {
      this._createImageSprite(node, baseRadius);
    }
  }

  _createLabel(node, radius) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const text = node.label || node.id;
    const fontSize = 42;
    ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;

    const padding = 24;
    canvas.width = nextPow2(textWidth + padding * 2);
    canvas.height = nextPow2(fontSize + padding * 2);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillText(text, canvas.width / 2 + 1, canvas.height / 2 + 1);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

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
    sprite.position.y = radius + 5;
    sprite.renderOrder = 1;

    const mesh = this.meshMap.get(node.id);
    mesh.add(sprite);
    this.labelMap.set(node.id, sprite);
  }

  _createImageSprite(node, radius) {
    this.loader.load(node.image, (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;

      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);

      const aspect = texture.image.width / texture.image.height;
      const size = IMAGE_SPRITE_SIZE * (node.size ?? 1);
      sprite.scale.set(size * aspect, size, 1);
      sprite.position.y = -(radius + 4);
      sprite.renderOrder = 1;

      const mesh = this.meshMap.get(node.id);
      if (mesh) {
        mesh.add(sprite);
        this.imageMap.set(node.id, sprite);
      }
    });
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
