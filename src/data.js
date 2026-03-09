/**
 * Graph data for course readings — organized by switchable connection categories.
 *
 * Each reading node carries metadata for:
 *   - audience, topic, focus, communicationStyle
 *
 * Connectors are represented as color-coded *fields* on each reading node,
 * rather than as separate hub nodes.
 */

// ── All 12 reading nodes ────────────────────────────────────────────

export const readings = [
  {
    id: "baer",
    label: 'Hans A. Baer\n"Global Capitalism\nand Climate Change"',
    shortLabel: "Baer",
    audience:
      "Academics, social scientists, progressive climate scientists, and university students",
    topic:
      "The systemic root causes of anthropogenic climate change within global economic structures",
    focus:
      "Global capitalism is fundamentally incompatible with a safe climate. Critiques the 'treadmill of production' and the myth of 'green capitalism,' advocating for an ecosocialist revolution.",
    communicationStyle:
      "Structural and systemic critique — uses academic, macro-level framing to shift blame from individual consumers onto global economic frameworks, dismantling the illusion that society can buy or invent its way out of crisis.",
    color: "#6366f1",
    size: 1.15,
  },
  {
    id: "bastian",
    label: 'Michelle Bastian\n"Fatally Confused:\nTelling the Time…"',
    shortLabel: "Bastian",
    audience:
      "Environmental philosophers, humanities scholars, and academic readers",
    topic: "The social and ecological philosophy of 'time' and synchronization",
    focus:
      "How conventional clock time disconnects humans from ecological realities. Treating nature as a stable background is a 'fatal confusion' preventing urgent action.",
    communicationStyle:
      "Deconstructive analysis via speech-act theory — analyzes standard time-telling as a 'non-performative' act (borrowing from Sara Ahmed) that gives the illusion of coordination while enabling the destructive status quo.",
    color: "#8b5cf6",
    size: 1.15,
  },
  {
    id: "dungy",
    label: 'Camille T. Dungy\n"Is All Writing\nEnvironmental Writing?"',
    shortLabel: "Dungy",
    audience:
      "Writers, poets, literary critics, and the general educated public",
    topic: "Ecopoetics, environmental writing, and intersectionality",
    focus:
      "'De-pristining' nature writing by integrating Black history, racial injustice, and built environments. The erasure of marginalized human experiences mirrors environmental destruction.",
    communicationStyle:
      "Blended genre (memoir, poetry, literary criticism) — uses personal anecdotes and vivid imagery to fuzz the lines between human and non-human worlds, demonstrating the argument through narrative.",
    color: "#10b981",
    size: 1.15,
  },
  {
    id: "klein",
    label: 'Naomi Klein\n"We have a once-in-\ncentury chance…"',
    shortLabel: "Klein",
    audience:
      "General public, climate activists, progressives, and youth movements",
    topic: "The Green New Deal and grassroots climate activism",
    focus:
      "Framing the climate crisis as a once-in-a-century opportunity to simultaneously fix failing economic and social models (wage stagnation, crumbling healthcare, racial inequality).",
    communicationStyle:
      "Intersectional and motivational rhetoric — rejects doom narratives, wielding 'hope' as a strategic survival tool. Links environmentalism to everyday struggles to widen the audience for collective political action.",
    color: "#ef4444",
    size: 1.15,
  },
  {
    id: "patringenaru",
    label: 'Ioana Patringenaru\n"Accelerating Climate\nModeling with AI"',
    shortLabel: "Patringenaru",
    audience:
      "University community, tech enthusiasts, and general science readers",
    topic: "The application of artificial intelligence in climate science",
    focus:
      "A new generative AI model (Spherical DYffusion) projects 100 years of climate patterns 25× faster using less computing power.",
    communicationStyle:
      "Institutional science journalism — straightforward, objective reporting utilizing statistics and expert quotes to highlight technological advancement without political or economic critique.",
    color: "#f59e0b",
    size: 1.15,
  },
  {
    id: "quaglia",
    label: 'Sofia Quaglia\n"101: Breaking Down\nGreenhouse Gases"',
    shortLabel: "Quaglia",
    audience:
      "General public and beginners seeking foundational environmental education",
    topic: "The science, history, and mitigation of greenhouse gases",
    focus:
      "Explaining GHG mechanics, identifying primary sources (fossil fuels, agriculture), and outlining solutions across systemic, collective, and household levels (referencing Project Drawdown).",
    communicationStyle:
      "Accessible educational primer — breaks complex science into digestible Q&A formats, balances systemic facts with empowering individual action items, avoids the paralysis that often accompanies climate education.",
    color: "#22c55e",
    size: 1.15,
  },
  {
    id: "stephens",
    label: 'Tory Stephens\n"We are what\nwe nurture"',
    shortLabel: "Stephens",
    audience:
      "Sci-fi fans, writers, and environmentalists interested in cultural production",
    topic: "Climate fiction ('cli-fi') and the power of storytelling",
    focus:
      "The necessity of 'hopepunk' and 'solarpunk' narratives imagining decolonized, intersectional, and equitable futures — pushing back against dystopian addiction.",
    communicationStyle:
      "Reflective manifesto — appeals to emotion and imagination, arguing that art and storytelling shape values. Focuses on 'nurturing' positive depictions to create imaginative conditions for real-world solutions.",
    color: "#ec4899",
    size: 1.15,
  },
  {
    id: "temple",
    label: "James Temple\n\"Sorry, AI won't 'fix'\nclimate change\"",
    shortLabel: "Temple",
    audience:
      "Tech industry professionals, policymakers, and business-minded readers",
    topic:
      "The limitations of technological silver bullets in addressing global warming",
    focus:
      "Rebutting tech-utopian claims (e.g. Sam Altman's). Climate change is an infrastructure, regulatory, and economic problem — not just a technological one.",
    communicationStyle:
      "Pragmatic countering — uses economic reasoning and practical realities to dismantle tech hype. Without aggressive policy and government regulation, technological breakthroughs alone are insufficient.",
    color: "#f97316",
    size: 1.15,
  },
  {
    id: "young",
    label: 'Vershawn A. Young\n"Should Writers Use\nThey Own English?"',
    shortLabel: "Young",
    audience:
      "Academics, writing instructors, linguists, and university students",
    topic:
      "Linguistic diversity, standard English ideology, and racism in education",
    focus:
      "Challenging the policing of 'Standard English' and advocating for 'code-meshing' — blending dialects, languages, and cultural rhetorical styles in formal writing.",
    communicationStyle:
      "Performative academic argument — deliberately writes using code-meshing (AAVE + academic discourse), embodying his argument to prove linguistic diversity enhances rhetorical effectiveness.",
    color: "#a855f7",
    size: 1.15,
  },
  {
    id: "barbaro",
    label: 'Michael Barbaro &\nDionne Searcey\n"A Wind Farm\nin Coal Country"',
    shortLabel: "Barbaro & Searcey",
    audience:
      "Podcast listeners, the general public, and politically engaged citizens",
    topic: "The economic transition to renewable energy in conservative areas",
    focus:
      "Conservative politicians support massive wind farm projects for economic survival and tax revenue, despite disbelieving in climate change — demonstrating economic pragmatism over ideology.",
    communicationStyle:
      "Audio narrative via 'rhetorical listening' — approaches climate skeptics without judgment, demonstrating how shared goals (economic stability) can drive climate action across ideological divides.",
    color: "#14b8a6",
    size: 1.15,
  },
  {
    id: "inoue",
    label: 'Asao Inoue\n"Interview on\nGrowByondGrades.org"',
    shortLabel: "Inoue",
    audience: "Educators, teachers, and academic administrators",
    topic: "Labor-based grading contracts and educational equity",
    focus:
      "Traditional grading is inaccurate and inequitable. Assessing 'labor' focuses students on learning experiences rather than the distracting power of hierarchical rankings.",
    communicationStyle:
      "Pedagogical interview — straightforward educational philosophy critiquing systemic norms, advocating a shift from instructor evaluation to student engagement and agency.",
    color: "#06b6d4",
    size: 1.15,
  },
  {
    id: "kasturirangan",
    label: 'Kasturirangan et al.\n"Climate Justice and\nIntersectionality"',
    shortLabel: "Kasturirangan et al.",
    audience:
      "Podcast listeners, academic communities, and environmental justice activists",
    topic:
      "The intersection of systemic racism, capitalism, and environmental degradation",
    focus:
      "Disproportionate climate impacts on marginalized communities and women. Highlights community-led solutions (microgrids) and political organizing through the NAACP.",
    communicationStyle:
      "Conversational, grounded intersectional analysis — translates academic concepts (patriarchy, monopoly capitalism) into real-world examples (asthma deaths, energy shutoffs) as a practical roadmap for local activism.",
    color: "#0ea5e9",
    size: 1.15,
  },
  {
    id: "ratcliffe",
    label: 'Ratcliffe \u0026 Jensen\n"A Rhetorical Education\nfor Listening Writers"',
    shortLabel: "Ratcliffe \u0026 Jensen",
    audience:
      "Students in writing classrooms, teachers (grades 9-12 and university level), administrators, and general readers looking to improve civil communication",
    topic:
      "The theory and application of rhetorical listening as a tool for navigating cultural conflicts, competing sets of facts, and communication across differences",
    focus:
      "The development of a rhetorical listening mindset through a 'concept-tactic' approach. Emphasizes moving from a 'win-lose' competitive model of communication to a 'win-win' model that fosters understanding and social justice by analyzing how language, identity (intersectionality), and 'terministic screens' shape perception of facts and truth.",
    communicationStyle:
      "Pedagogical, analytical, and inclusive — uses a structured, educational tone to bridge complex rhetorical theory (epistemology, ontology, Burkean 'terministic screens') and everyday writing tasks. Models specific 'moves' such as framing topics as rhetorical problems and assuming a 'writerly stance,' translating academic concepts into a practical toolbox for ethical engagement in a polarized society.",
    color: "#e879f9",
    size: 1.15,
  },
];

// ── Category definitions ────────────────────────────────────────────
// Each category defines connector fields and assigns readings to those fields.
// Connectors are shown as color-coded tags on each reading node (not as separate nodes).

export const categories = {
  audience: {
    label: "Audience",
    description: "Who is each text written for?",
    connectors: [
      {
        id: "aud-academic",
        label: "Academic Scholars",
        color: "#4f46e5",
      },
      {
        id: "aud-general",
        label: "General Public",
        color: "#16a34a",
      },
      {
        id: "aud-tech",
        label: "Tech & Science Readers",
        color: "#d97706",
      },
      {
        id: "aud-creative",
        label: "Writers & Creatives",
        color: "#db2777",
      },
      {
        id: "aud-activists",
        label: "Activists & Movements",
        color: "#dc2626",
      },
      {
        id: "aud-educators",
        label: "Educators & Students",
        color: "#0891b2",
      },
    ],
    connections: [
      { reading: "baer", connectors: ["aud-academic", "aud-educators"] },
      { reading: "bastian", connectors: ["aud-academic"] },
      { reading: "dungy", connectors: ["aud-creative", "aud-general"] },
      { reading: "klein", connectors: ["aud-general", "aud-activists"] },
      { reading: "patringenaru", connectors: ["aud-tech", "aud-educators"] },
      { reading: "quaglia", connectors: ["aud-general"] },
      { reading: "stephens", connectors: ["aud-creative", "aud-activists"] },
      { reading: "temple", connectors: ["aud-tech"] },
      { reading: "young", connectors: ["aud-academic", "aud-educators"] },
      { reading: "barbaro", connectors: ["aud-general"] },
      { reading: "inoue", connectors: ["aud-educators"] },
      { reading: "kasturirangan", connectors: ["aud-activists", "aud-academic"] },
      { reading: "ratcliffe", connectors: ["aud-educators", "aud-general"] },
    ],
  },

  topic: {
    label: "Topic",
    description: "What core subject does each text address?",
    connectors: [
      {
        id: "top-econ-climate",
        label: "Economic Systems & Climate",
        color: "#b91c1c",
      },
      {
        id: "top-justice",
        label: "Justice & Intersectionality",
        color: "#7c3aed",
      },
      {
        id: "top-tech",
        label: "Technology & Solutions",
        color: "#ca8a04",
      },
      {
        id: "top-narrative",
        label: "Narrative, Culture & Time",
        color: "#be185d",
      },
      {
        id: "top-education",
        label: "Education & Language",
        color: "#0e7490",
      },
      {
        id: "top-science",
        label: "Climate Science",
        color: "#15803d",
      },
    ],
    connections: [
      { reading: "baer", connectors: ["top-econ-climate"] },
      { reading: "bastian", connectors: ["top-narrative", "top-science"] },
      { reading: "dungy", connectors: ["top-justice", "top-narrative"] },
      { reading: "klein", connectors: ["top-econ-climate", "top-justice"] },
      { reading: "patringenaru", connectors: ["top-tech", "top-science"] },
      { reading: "quaglia", connectors: ["top-science"] },
      { reading: "stephens", connectors: ["top-narrative", "top-justice"] },
      { reading: "temple", connectors: ["top-tech", "top-econ-climate"] },
      { reading: "young", connectors: ["top-education", "top-justice"] },
      { reading: "barbaro", connectors: ["top-econ-climate", "top-tech"] },
      { reading: "inoue", connectors: ["top-education"] },
      { reading: "kasturirangan", connectors: ["top-justice", "top-econ-climate"] },
      { reading: "ratcliffe", connectors: ["top-education"] },
    ],
  },

  focus: {
    label: "Focus / Argument",
    description: "What central argument or angle does each text take?",
    connectors: [
      {
        id: "foc-systemic",
        label: "Systemic Critique",
        color: "#1d4ed8",
      },
      {
        id: "foc-intersect",
        label: "Intersectional Justice",
        color: "#9333ea",
      },
      {
        id: "foc-hope",
        label: "Hope & Solutions",
        color: "#059669",
      },
      {
        id: "foc-pragmatic",
        label: "Economic Pragmatism",
        color: "#ea580c",
      },
      {
        id: "foc-pedagogy",
        label: "Pedagogical Reform",
        color: "#0284c7",
      },
      {
        id: "foc-tech-limit",
        label: "Limits of Technology",
        color: "#e11d48",
      },
    ],
    connections: [
      { reading: "baer", connectors: ["foc-systemic"] },
      { reading: "bastian", connectors: ["foc-systemic"] },
      { reading: "dungy", connectors: ["foc-intersect"] },
      { reading: "klein", connectors: ["foc-hope", "foc-intersect"] },
      { reading: "patringenaru", connectors: ["foc-hope"] },
      { reading: "quaglia", connectors: ["foc-hope"] },
      { reading: "stephens", connectors: ["foc-hope", "foc-intersect"] },
      { reading: "temple", connectors: ["foc-tech-limit", "foc-systemic"] },
      { reading: "young", connectors: ["foc-pedagogy", "foc-intersect"] },
      { reading: "barbaro", connectors: ["foc-pragmatic"] },
      { reading: "inoue", connectors: ["foc-pedagogy"] },
      { reading: "kasturirangan", connectors: ["foc-intersect", "foc-systemic"] },
      { reading: "ratcliffe", connectors: ["foc-pedagogy", "foc-intersect"] },
    ],
  },

  communication: {
    label: "Communication Style",
    description: "How does each author communicate their argument?",
    connectors: [
      {
        id: "com-academic",
        label: "Academic Analysis",
        color: "#3730a3",
      },
      {
        id: "com-journalism",
        label: "Journalistic Reporting",
        color: "#b45309",
      },
      {
        id: "com-personal",
        label: "Personal Narrative",
        color: "#a21caf",
      },
      {
        id: "com-activist",
        label: "Activist & Motivational",
        color: "#c2410c",
      },
      {
        id: "com-educational",
        label: "Educational Primer",
        color: "#047857",
      },
      {
        id: "com-performative",
        label: "Performative & Embodied",
        color: "#6d28d9",
      },
    ],
    connections: [
      { reading: "baer", connectors: ["com-academic"] },
      { reading: "bastian", connectors: ["com-academic"] },
      { reading: "dungy", connectors: ["com-personal"] },
      { reading: "klein", connectors: ["com-activist"] },
      { reading: "patringenaru", connectors: ["com-journalism"] },
      { reading: "quaglia", connectors: ["com-educational"] },
      { reading: "stephens", connectors: ["com-personal", "com-activist"] },
      { reading: "temple", connectors: ["com-journalism"] },
      { reading: "young", connectors: ["com-performative", "com-academic"] },
      { reading: "barbaro", connectors: ["com-journalism", "com-performative"] },
      { reading: "inoue", connectors: ["com-educational"] },
      { reading: "kasturirangan", connectors: ["com-activist", "com-educational"] },
      { reading: "ratcliffe", connectors: ["com-educational", "com-academic"] },
    ],
  },
};

/**
 * Build a complete { nodes, edges } graph for a given category key.
 * Nodes are only readings — connectors are stored as fields on each node.
 * Edges connect readings that share at least one connector.
 */
export function buildGraph(categoryKey) {
  const cat = categories[categoryKey];
  if (!cat) throw new Error(`Unknown category: ${categoryKey}`);

  // Build a map from connectorId → connector definition for quick lookup
  const connectorMap = new Map(cat.connectors.map((c) => [c.id, c]));

  // Build a map from readingId → array of connector objects
  const readingConnectors = new Map();
  for (const conn of cat.connections) {
    const connObjs = conn.connectors.map((cId) => connectorMap.get(cId));
    readingConnectors.set(conn.reading, connObjs);
  }

  const nodes = readings.map((r) => {
    const connFields = readingConnectors.get(r.id) || [];
    // Derive node color from its connector colors (blended average)
    const blendedColor = blendConnectorColors(connFields);
    return {
      ...r,
      color: blendedColor || r.color, // fallback to original if no connectors
      group: "reading",
      text: getCategoryText(r, categoryKey),
      connectorFields: connFields,
    };
  });

  // Edges: connect readings that share at least one connector
  const edges = [];
  const edgeSet = new Set();

  // Build connector → readings membership
  const connectorMembers = new Map();
  for (const conn of cat.connections) {
    for (const cId of conn.connectors) {
      if (!connectorMembers.has(cId)) connectorMembers.set(cId, []);
      connectorMembers.get(cId).push(conn.reading);
    }
  }

  for (const [connectorId, members] of connectorMembers) {
    const connector = connectorMap.get(connectorId);
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const key = [members[i], members[j]].sort().join("--");
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({
            source: members[i],
            target: members[j],
            connectorColor: connector.color,
            connectorLabel: connector.label,
          });
        }
      }
    }
  }

  return { nodes, edges, connectors: cat.connectors };
}

function getCategoryText(reading, categoryKey) {
  switch (categoryKey) {
    case "audience":
      return `Audience: ${reading.audience}`;
    case "topic":
      return `Topic: ${reading.topic}`;
    case "focus":
      return `Focus: ${reading.focus}`;
    case "communication":
      return `Style: ${reading.communicationStyle}`;
    default:
      return reading.topic;
  }
}

/**
 * Blend an array of connector colors (hex strings) into one averaged color.
 * Returns a hex string like "#aabbcc", or null if no connectors.
 */
function blendConnectorColors(connectors) {
  if (!connectors || connectors.length === 0) return null;

  let r = 0, g = 0, b = 0;
  for (const c of connectors) {
    const hex = c.color.replace("#", "");
    r += parseInt(hex.substring(0, 2), 16);
    g += parseInt(hex.substring(2, 4), 16);
    b += parseInt(hex.substring(4, 6), 16);
  }

  const n = connectors.length;
  r = Math.round(r / n);
  g = Math.round(g / n);
  b = Math.round(b / n);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
