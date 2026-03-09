import * as THREE from "three";

/**
 * Renders connector categories as translucent "spheres of influence".
 *
 * Uses screen-facing sprite billboards with a radial gradient texture
 * generated on a canvas for pixel-perfect smooth gradients in all views.
 */

function makeGradientTexture(color, size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  gradient.addColorStop(0.0, color + "59");   // 35% alpha at center
  gradient.addColorStop(0.25, color + "40");  // 25% alpha
  gradient.addColorStop(0.5, color + "26");   // 15% alpha
  gradient.addColorStop(0.75, color + "12");  // 7% alpha
  gradient.addColorStop(0.9, color + "08");   // 3% alpha
  gradient.addColorStop(1.0, color + "00");   // fully transparent

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function saturateColor(hex) {
  // Parse hex to RGB, convert to HSL, boost saturation, convert back
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  // Boost saturation to 100%, nudge lightness up slightly
  s = 1.0;
  l = Math.min(l + 0.08, 0.6);

  // HSL → RGB
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }
  const q2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p2 = 2 * l - q2;
  const rr = Math.round(hue2rgb(p2, q2, h + 1/3) * 255);
  const gg = Math.round(hue2rgb(p2, q2, h) * 255);
  const bb = Math.round(hue2rgb(p2, q2, h - 1/3) * 255);

  return "#" + ((1 << 24) + (rr << 16) + (gg << 8) + bb).toString(16).slice(1);
}

function makeHighlightTexture(color, size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  const vivid = saturateColor(color);

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  gradient.addColorStop(0.0, vivid + "99");   // 60% alpha — saturated core
  gradient.addColorStop(0.25, vivid + "73");  // 45% alpha
  gradient.addColorStop(0.5, vivid + "40");   // 25% alpha
  gradient.addColorStop(0.75, vivid + "20");  // 12% alpha
  gradient.addColorStop(0.9, vivid + "0d");   // 5% alpha
  gradient.addColorStop(1.0, vivid + "00");   // fully transparent

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export class FieldRenderer {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.fields = [];
  }

  createField(connector, memberReadingIds) {
    const normalTex = makeGradientTexture(connector.color);
    const highlightTex = makeHighlightTexture(connector.color);

    const mat = new THREE.SpriteMaterial({
      map: normalTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const sprite = new THREE.Sprite(mat);
    sprite.renderOrder = -1;
    this.group.add(sprite);

    this.fields.push({
      sprite,
      memberIds: memberReadingIds,
      color: connector.color,
      label: connector.label,
      id: connector.id,
      normalTex,
      highlightTex,
    });
  }

  updatePositions(nodeById) {
    for (const field of this.fields) {
      const members = field.memberIds
        .map((id) => nodeById.get(id))
        .filter(Boolean);
      if (members.length === 0) continue;

      let cx = 0, cy = 0, cz = 0;
      for (const m of members) { cx += m.x; cy += m.y; cz += m.z; }
      cx /= members.length;
      cy /= members.length;
      cz /= members.length;

      let maxDist = 0;
      for (const m of members) {
        const dist = Math.sqrt(
          (m.x - cx) ** 2 + (m.y - cy) ** 2 + (m.z - cz) ** 2
        );
        if (dist > maxDist) maxDist = dist;
      }

      const radius = Math.max(maxDist + 35, 30);
      const diameter = radius * 2;

      field.sprite.position.set(cx, cy, cz);
      field.sprite.scale.set(diameter, diameter, 1);
    }
  }

  highlightFields(connectorIds) {
    for (const field of this.fields) {
      if (connectorIds.includes(field.id)) {
        field.sprite.material.map = field.highlightTex;
        field.sprite.material.opacity = 1.0;
        field.sprite.material.needsUpdate = true;
      } else {
        // Dim non-highlighted fields
        field.sprite.material.opacity = 0.15;
        field.sprite.material.needsUpdate = true;
      }
    }
  }

  resetHighlight() {
    for (const field of this.fields) {
      field.sprite.material.map = field.normalTex;
      field.sprite.material.opacity = 1.0;
      field.sprite.material.needsUpdate = true;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    for (const field of this.fields) {
      field.sprite.material.map.dispose();
      field.highlightTex.dispose();
      field.sprite.material.dispose();
    }
    this.fields = [];
  }
}
