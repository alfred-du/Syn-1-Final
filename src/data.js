/**
 * Sample graph data. Each node can carry:
 *   - label  (string)  — rendered as a sprite above the sphere
 *   - text   (string)  — shown in the hover tooltip
 *   - image  (string)  — URL shown in the hover tooltip & optionally on the node
 *   - color  (hex)     — node sphere colour
 *   - size   (number)  — relative radius multiplier (default 1)
 *
 * Edges reference nodes by id.
 */

export const graphData = {
  nodes: [
    {
      id: "ai",
      label: "Artificial Intelligence",
      text: "The broad field of creating intelligent machines that can perform tasks typically requiring human intelligence.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
      color: "#6366f1",
      size: 1.6,
    },
    {
      id: "ml",
      label: "Machine Learning",
      text: "A subset of AI that enables systems to learn and improve from experience without being explicitly programmed.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=80",
      color: "#8b5cf6",
      size: 1.4,
    },
    {
      id: "dl",
      label: "Deep Learning",
      text: "Neural networks with many layers that can learn complex patterns in large amounts of data.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80",
      color: "#a78bfa",
      size: 1.2,
    },
    {
      id: "nlp",
      label: "Natural Language Processing",
      text: "Enabling machines to understand, interpret, and generate human language.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
      color: "#38bdf8",
      size: 1.1,
    },
    {
      id: "cv",
      label: "Computer Vision",
      text: "Teaching computers to interpret and understand visual information from the world.",
      image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&q=80",
      color: "#22d3ee",
      size: 1.1,
    },
    {
      id: "rl",
      label: "Reinforcement Learning",
      text: "Training agents to make sequences of decisions by rewarding desired behaviours.",
      image: "https://images.unsplash.com/photo-1531746790095-e5995bfbe958?w=400&q=80",
      color: "#f472b6",
      size: 1.0,
    },
    {
      id: "robotics",
      label: "Robotics",
      text: "Designing and building robots that can interact with the physical world autonomously.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80",
      color: "#fb923c",
      size: 1.0,
    },
    {
      id: "ethics",
      label: "AI Ethics",
      text: "The study of moral principles guiding the development and deployment of AI systems.",
      image: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&q=80",
      color: "#4ade80",
      size: 0.9,
    },
    {
      id: "data",
      label: "Data Science",
      text: "Extracting knowledge and insights from structured and unstructured data.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
      color: "#facc15",
      size: 1.2,
    },
    {
      id: "acl",
      label: "Auto ML",
      text: "Automating the end-to-end process of applying machine learning to real-world problems.",
      image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&q=80",
      color: "#e879f9",
      size: 0.9,
    },
  ],

  edges: [
    { source: "ai", target: "ml" },
    { source: "ai", target: "nlp" },
    { source: "ai", target: "cv" },
    { source: "ai", target: "robotics" },
    { source: "ai", target: "ethics" },
    { source: "ml", target: "dl" },
    { source: "ml", target: "rl" },
    { source: "ml", target: "data" },
    { source: "ml", target: "acl" },
    { source: "dl", target: "nlp" },
    { source: "dl", target: "cv" },
    { source: "rl", target: "robotics" },
    { source: "data", target: "acl" },
    { source: "ethics", target: "data" },
  ],
};
