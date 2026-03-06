# 3D Force Graph Template

A Three.js-powered 3D force-directed graph where each node supports **text**, **images**, and **labels**.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Controls

| Action | Input |
|--------|-------|
| Rotate | Click + drag |
| Zoom | Scroll wheel |
| Hover | Shows tooltip with image, label, and text |
| Click node | Camera focuses on that node |

## Customising Nodes

Edit `src/data.js`. Each node object accepts:

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier (required) |
| `label` | string | Floating text above the node |
| `text` | string | Description shown in the tooltip |
| `image` | string | Image URL shown in tooltip and below the node |
| `color` | hex string | Sphere and glow colour |
| `size` | number | Relative size multiplier (default `1`) |

Edges connect nodes by `source` and `target` IDs.

## Project Structure

```
src/
  main.js            — Scene setup, animation loop, interaction
  data.js            — Sample graph data (nodes + edges)
  ForceSimulation.js — 3D force-directed layout engine
  NodeRenderer.js    — Sphere, label sprite, image sprite per node
  EdgeRenderer.js    — Line geometry between connected nodes
  Tooltip.js         — HTML tooltip on hover
```

## Build

```bash
npm run build     # Production build → dist/
npm run preview   # Preview the build locally
```
