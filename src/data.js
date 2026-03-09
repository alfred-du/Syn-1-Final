/**
 * Graph data for course readings.
 * Reading nodes connect to thematic topic hubs.
 */

export const graphData = {
  nodes: [
    // ── Topic hubs ──────────────────────────────────────────────────
    {
      id: "writing",
      label: "Writing & Rhetoric",
      text: "Core principles of effective, intentional writing across genres and contexts.",
      color: "#6366f1",
      size: 1.8,
      group: "topic",
    },
    {
      id: "environment",
      label: "Environment & Climate",
      text: "Understanding ecological crises, greenhouse gases, and the relationship between writing and the natural world.",
      color: "#22c55e",
      size: 1.8,
      group: "topic",
    },
    {
      id: "technology",
      label: "Technology & AI",
      text: "The role of artificial intelligence and technology in addressing — or failing to address — climate change.",
      color: "#f59e0b",
      size: 1.6,
      group: "topic",
    },
    {
      id: "language",
      label: "Language & Identity",
      text: "How language choices reflect identity, power, and cultural context in written expression.",
      color: "#ec4899",
      size: 1.6,
      group: "topic",
    },
    {
      id: "critical",
      label: "Critical Analysis",
      text: "Frameworks for reading, evaluating, and engaging with texts at a deeper level.",
      color: "#14b8a6",
      size: 1.6,
      group: "topic",
    },

    // ── Readings ────────────────────────────────────────────────────
    {
      id: "reading-critically",
      label: '"Reading Critically"\nfrom Sound Writing',
      text: "A foundational guide to active, analytical reading — questioning assumptions, identifying arguments, and engaging with texts beyond surface meaning.",
      color: "#818cf8",
      size: 1.1,
      group: "reading",
    },
    {
      id: "env-writing",
      label: '"Is All Writing\nEnvironmental Writing?"\nby Camille Dungy',
      text: "Camille Dungy explores whether every act of writing inherently engages with the environment, challenging narrow definitions of 'nature writing.'",
      color: "#4ade80",
      size: 1.1,
      group: "reading",
    },
    {
      id: "fatally-confused",
      label: '"Fatally Confused: Telling\nthe Time in the Midst\nof Ecological Crisis"',
      text: "An examination of how temporal disorientation shapes our understanding of and response to ecological emergencies.",
      color: "#34d399",
      size: 1.1,
      group: "reading",
    },
    {
      id: "own-language",
      label: '"Should Writers Use\nThey Own Language?"',
      text: "A provocative argument for linguistic diversity in writing, questioning the dominance of 'standard' English and advocating for authentic voice.",
      color: "#f472b6",
      size: 1.1,
      group: "reading",
    },
    {
      id: "awareness",
      label: "Chp. 6: Writing\nwith Awareness",
      text: "Developing consciousness about audience, purpose, and the social impact of language choices in writing.",
      color: "#c084fc",
      size: 1.1,
      group: "reading",
    },
    {
      id: "greenhouse",
      label: '"101: Breaking Down\nGreenhouse Gases"',
      text: "An accessible primer on the science of greenhouse gases — what they are, where they come from, and why they matter.",
      color: "#a3e635",
      size: 1.1,
      group: "reading",
    },
    {
      id: "ai-climate",
      label: '"Sorry, AI Won\'t \'Fix\'\nClimate Change"',
      text: "A critical take on the techno-optimist narrative, arguing that AI alone cannot solve the structural and political dimensions of climate change.",
      color: "#fb923c",
      size: 1.1,
      group: "reading",
    },
    {
      id: "accel-climate",
      label: '"Accelerating Climate\nModeling with\nGenerative AI"',
      text: "How generative AI models are being used to speed up climate simulations and improve predictive accuracy for climate science.",
      color: "#fbbf24",
      size: 1.1,
      group: "reading",
    },
  ],

  edges: [
    // Readings → topic hubs
    { source: "reading-critically", target: "writing" },
    { source: "reading-critically", target: "critical" },

    { source: "env-writing", target: "environment" },
    { source: "env-writing", target: "writing" },

    { source: "fatally-confused", target: "environment" },
    { source: "fatally-confused", target: "critical" },

    { source: "own-language", target: "language" },
    { source: "own-language", target: "writing" },

    { source: "awareness", target: "writing" },
    { source: "awareness", target: "language" },

    { source: "greenhouse", target: "environment" },

    { source: "ai-climate", target: "technology" },
    { source: "ai-climate", target: "environment" },

    { source: "accel-climate", target: "technology" },
    { source: "accel-climate", target: "environment" },

    // Cross-connections between related readings
    { source: "reading-critically", target: "awareness" },
    { source: "env-writing", target: "fatally-confused" },
    { source: "ai-climate", target: "accel-climate" },
    { source: "own-language", target: "awareness" },
    { source: "greenhouse", target: "ai-climate" },
    { source: "greenhouse", target: "fatally-confused" },

    // Topic hub inter-connections
    { source: "writing", target: "critical" },
    { source: "writing", target: "language" },
    { source: "environment", target: "technology" },
  ],
};
