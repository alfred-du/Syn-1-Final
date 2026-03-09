import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { graphData } from "./data.js";
import { ForceSimulation } from "./ForceSimulation.js";
import { NodeRenderer } from "./NodeRenderer.js";
import { EdgeRenderer } from "./EdgeRenderer.js";
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
scene.fog = new THREE.FogExp2(0x0a0a1a, 0.0012);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.5,
  2000,
);
camera.position.set(0, 60, 300);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.6;
controls.zoomSpeed = 1.0;
controls.minDistance = 30;
controls.maxDistance = 800;

// ─── Lighting ───────────────────────────────────────────────────────

scene.add(new THREE.AmbientLight(0x334466, 1.8));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(60, 100, 80);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x6688cc, 0.6);
fillLight.position.set(-50, -20, -60);
scene.add(fillLight);

// Subtle starfield background
createStarfield(scene);

// ─── Graph Data ─────────────────────────────────────────────────────

const nodes = graphData.nodes.map((n) => ({ ...n }));
const nodeById = new Map(nodes.map((n) => [n.id, n]));

const edges = graphData.edges.map((e) => ({
  ...e,
  sourceNode: nodeById.get(e.source),
  targetNode: nodeById.get(e.target),
}));

// ─── Simulation ─────────────────────────────────────────────────────

const sim = new ForceSimulation(nodes, edges, {
  repulsion: -400,
  linkDistance: 100,
  linkStrength: 0.03,
  centerStrength: 0.005,
});

// ─── Renderers ──────────────────────────────────────────────────────

const nodeRenderer = new NodeRenderer(scene);
const edgeRenderer = new EdgeRenderer(scene);
const tooltip = new Tooltip();

for (const n of nodes) nodeRenderer.createNode(n);
for (const e of edges) edgeRenderer.createEdge(e);

// ─── Interaction ────────────────────────────────────────────────────

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredNode = null;

function onPointerMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(nodeRenderer.getMeshes(), false);

  const hitNode = hits.length > 0 ? hits[0].object.userData.nodeId : null;

  if (hitNode !== hoveredNode) {
    if (hoveredNode) {
      nodeRenderer.unhighlight(hoveredNode);
      edgeRenderer.resetHighlight();
      tooltip.hide();
    }

    hoveredNode = hitNode;

    if (hoveredNode) {
      nodeRenderer.highlight(hoveredNode);
      edgeRenderer.highlightEdgesOf(hoveredNode);
      const node = nodeById.get(hoveredNode);
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

  sim.tick();
  nodeRenderer.updatePositions(nodes);
  edgeRenderer.updatePositions(edges);

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
  const count = 1500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1200;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x555577,
    size: 0.6,
    transparent: true,
    opacity: 0.6,
  });
  scene.add(new THREE.Points(geo, mat));
}
