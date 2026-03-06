/**
 * Manages the HTML tooltip that appears on node hover,
 * displaying the node's image, label, and text.
 */

export class Tooltip {
  constructor() {
    this.el = document.getElementById("tooltip");
  }

  show(node, screenX, screenY) {
    let html = "";

    if (node.image) {
      html += `<img src="${node.image}" alt="${node.label ?? ""}" />`;
    }

    if (node.label) {
      html += `<div class="tt-label">${node.label}</div>`;
    }

    if (node.text) {
      html += `<div class="tt-text">${node.text}</div>`;
    }

    this.el.innerHTML = html;
    this.el.classList.add("visible");

    const pad = 16;
    const rect = this.el.getBoundingClientRect();
    let x = screenX + pad;
    let y = screenY + pad;

    if (x + rect.width > window.innerWidth) x = screenX - rect.width - pad;
    if (y + rect.height > window.innerHeight) y = screenY - rect.height - pad;

    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
  }

  hide() {
    this.el.classList.remove("visible");
  }
}
