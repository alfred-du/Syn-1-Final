/**
 * Manages the HTML tooltip that appears on node hover,
 * displaying the node's label, contextual text, and connector tags.
 */

export class Tooltip {
  constructor() {
    this.el = document.getElementById("tooltip");
  }

  show(node, screenX, screenY) {
    let html = "";

    if (node.label) {
      const displayLabel = node.label.replace(/\n/g, " ");
      html += `<div class="tt-label">${displayLabel}</div>`;
    }

    if (node.shortLabel) {
      html += `<div class="tt-author">${node.shortLabel}</div>`;
    }

    if (node.text) {
      html += `<div class="tt-text">${node.text}</div>`;
    }

    // Show connector tags
    if (node.connectorFields && node.connectorFields.length > 0) {
      html += `<div class="tt-connectors">`;
      for (const c of node.connectorFields) {
        html += `<span class="tt-connector-tag" style="background: ${c.color}20; color: ${c.color}; border: 1px solid ${c.color}40;">${c.label}</span>`;
      }
      html += `</div>`;
    }

    html += `<div class="tt-badge reading">Course Reading</div>`;

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
