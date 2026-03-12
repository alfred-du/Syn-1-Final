import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { categories, buildGraph } from "./data.js";
import { ForceSimulation } from "./ForceSimulation.js";
import { NodeRenderer } from "./NodeRenderer.js";
import { EdgeRenderer } from "./EdgeRenderer.js";
import { FieldRenderer } from "./FieldRenderer.js";
import { Tooltip } from "./Tooltip.js";

// ─── Scene Setup ────────────────────────────────────────────────────

const container = document.getElementById("app");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a110c, 0.0008);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.5,
  2000,
);
camera.position.set(0, 60, 350);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.6;
controls.zoomSpeed = 1.0;
controls.minDistance = 30;
controls.maxDistance = 800;

// ─── Lighting ───────────────────────────────────────────────────────

scene.add(new THREE.AmbientLight(0x3a4a3a, 1.8));

const keyLight = new THREE.DirectionalLight(0xfff8e7, 1.2);
keyLight.position.set(60, 100, 80);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x6b8a5e, 0.6);
fillLight.position.set(-50, -20, -60);
scene.add(fillLight);

// Starfield
createStarfield(scene);

// ─── State ──────────────────────────────────────────────────────────

let currentCategory = "audience";
let nodes = [];
let edges = [];
let nodeById = new Map();
let sim = null;
let nodeRenderer = new NodeRenderer(scene);
let edgeRenderer = new EdgeRenderer(scene);
let fieldRenderer = new FieldRenderer(scene);
const tooltip = new Tooltip();

// ─── Build / Rebuild Graph ──────────────────────────────────────────

function loadCategory(catKey) {
  currentCategory = catKey;

  // Clear old renderers
  nodeRenderer.dispose();
  edgeRenderer.dispose();
  fieldRenderer.dispose();

  nodeRenderer = new NodeRenderer(scene);
  edgeRenderer = new EdgeRenderer(scene);
  fieldRenderer = new FieldRenderer(scene);

  // Build new data
  const graphData = buildGraph(catKey);
  nodes = graphData.nodes.map((n) => ({ ...n }));
  nodeById = new Map(nodes.map((n) => [n.id, n]));

  edges = graphData.edges.map((e) => ({
    ...e,
    sourceNode: nodeById.get(e.source),
    targetNode: nodeById.get(e.target),
  }));

  // Build connector groups for clustering
  const cat = categories[catKey];
  const connectorGroups = cat.connectors.map((connector) => ({
    connectorId: connector.id,
    memberIds: cat.connections
      .filter((c) => c.connectors.includes(connector.id))
      .map((c) => c.reading),
  }));

  // Simulation — only reading nodes now, no hubs
  sim = new ForceSimulation(nodes, edges, {
    repulsion: -600,
    linkDistance: 80,
    linkStrength: 0.07,
    centerStrength: 0.005,
    clusterStrength: 0.08,
    similarityStrength: 0.04,
    connectorGroups,
  });

  // Render nodes and edges
  for (const n of nodes) nodeRenderer.createNode(n);
  for (const e of edges) edgeRenderer.createEdge(e);

  // Create influence fields for each connector
  for (const connector of cat.connectors) {
    const memberIds = cat.connections
      .filter((c) => c.connectors.includes(connector.id))
      .map((c) => c.reading);
    fieldRenderer.createField(connector, memberIds);
  }

  // Update sidebar description
  const descEl = document.getElementById("category-desc");
  if (descEl) descEl.textContent = cat.description;

  // Update selector
  const select = document.getElementById("category-select");
  if (select) select.value = catKey;

  // Update legend/key
  updateLegend(graphData.connectors);
}

// ─── Dynamic Legend ─────────────────────────────────────────────────

function updateLegend(connectors) {
  const legendItems = document.getElementById("legend-items");
  if (!legendItems) return;

  legendItems.innerHTML = "";

  for (const c of connectors) {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.dataset.connectorId = c.id;
    item.style.cursor = "pointer";
    item.innerHTML = `
      <div class="legend-dot field-dot" style="background: ${c.color}; box-shadow: 0 0 8px ${c.color}60;"></div>
      ${c.label}
    `;

    // Hover legend item → highlight corresponding field
    item.addEventListener("mouseenter", () => {
      fieldRenderer.highlightFields([c.id]);
    });
    item.addEventListener("mouseleave", () => {
      fieldRenderer.resetHighlight();
    });

    legendItems.appendChild(item);
  }

  // Add a separator and node type
  const sep = document.createElement("div");
  sep.className = "legend-separator";
  legendItems.appendChild(sep);

  const readingItem = document.createElement("div");
  readingItem.className = "legend-item";
  readingItem.innerHTML = `
    <div class="legend-dot" style="background: #7dab7a;"></div>
    Reading Node
  `;
  legendItems.appendChild(readingItem);

  const edgeItem = document.createElement("div");
  edgeItem.className = "legend-item";
  edgeItem.innerHTML = `
    <div class="legend-dot" style="background: rgba(120,145,110,0.7); width: 20px; height: 2px; border-radius: 1px;"></div>
    Shared Connection
  `;
  legendItems.appendChild(edgeItem);
}

// ─── UI Setup ───────────────────────────────────────────────────────

function setupUI() {
  const select = document.getElementById("category-select");
  if (!select) return;

  // Populate options
  for (const [key, cat] of Object.entries(categories)) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = cat.label;
    select.appendChild(opt);
  }

  select.addEventListener("change", (e) => {
    loadCategory(e.target.value);
  });
}

setupUI();
loadCategory("audience");

// ─── Interaction ────────────────────────────────────────────────────

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredNode = null;

function onPointerMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const meshes = nodeRenderer.getMeshes();
  const hits = raycaster.intersectObjects(meshes, false);

  const hitNode = hits.length > 0 ? hits[0].object.userData.nodeId : null;

  if (hitNode !== hoveredNode) {
    if (hoveredNode) {
      nodeRenderer.unhighlight(hoveredNode);
      edgeRenderer.resetHighlight();
      fieldRenderer.resetHighlight();
      tooltip.hide();
    }

    hoveredNode = hitNode;

    if (hoveredNode) {
      nodeRenderer.highlight(hoveredNode);
      edgeRenderer.highlightEdgesOf(hoveredNode);

      // Highlight the fields this reading belongs to
      const node = nodeById.get(hoveredNode);
      if (node && node.connectorFields) {
        const connIds = node.connectorFields.map((c) => c.id);
        fieldRenderer.highlightFields(connIds);
      }

      tooltip.show(node, event.clientX, event.clientY);
    }
  } else if (hoveredNode) {
    tooltip.show(nodeById.get(hoveredNode), event.clientX, event.clientY);
  }
}

function onClick(event) {
  if (!hoveredNode) return;
  const node = nodeById.get(hoveredNode);
  if (!node) return;

  const target = new THREE.Vector3(node.x, node.y, node.z);
  const dir = new THREE.Vector3()
    .subVectors(camera.position, controls.target)
    .normalize()
    .multiplyScalar(60);
  const dest = target.clone().add(dir);

  animateCamera(dest, target, 800);
}

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", onClick);

// ─── Resize ─────────────────────────────────────────────────────────

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── Animation Loop ─────────────────────────────────────────────────

function animate() {
  requestAnimationFrame(animate);

  if (sim) {
    sim.tick();
    nodeRenderer.updatePositions(nodes);
    edgeRenderer.updatePositions(edges);
    fieldRenderer.updatePositions(nodeById);
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

// ─── Helpers ────────────────────────────────────────────────────────

function animateCamera(destPos, destTarget, duration) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime = performance.now();

  function step() {
    const elapsed = performance.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    camera.position.lerpVectors(startPos, destPos, ease);
    controls.target.lerpVectors(startTarget, destTarget, ease);

    if (t < 1) requestAnimationFrame(step);
  }

  step();
}

function createStarfield(scene) {
  const count = 2000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1500;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1500;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x556b4e,
    size: 0.6,
    transparent: true,
    opacity: 0.5,
  });
  scene.add(new THREE.Points(geo, mat));
}
