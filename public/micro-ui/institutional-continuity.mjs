function h(type, style, ...children) {
  const props = { style };
  if (children.length === 1) props.children = children[0];
  else if (children.length > 1) props.children = children;
  return { type, props };
}

function svg(type, attrs, ...children) {
  const props = { ...attrs };
  if (children.length === 1) props.children = children[0];
  else if (children.length > 1) props.children = children;
  return { type, props };
}

const WIDTH = 540;
const HEIGHT = 420;

// Hero node — the "current year" anchor (amber, glow)
const hero = { x: 268, y: 222, r: 11, color: "#fbbf24", label: "Active · 2026" };

// Primary nodes (larger, labeled)
const primary = [
  { x: 110, y: 118, r: 9, color: "#1f2937", label: "Program rules" },
  { x: 420, y: 102, r: 9, color: "#4f46e5", label: "Block templates" },
  { x: 96, y: 312, r: 9, color: "#4f46e5", label: "Constraints" },
  { x: 432, y: 310, r: 9, color: "#1f2937", label: "Site requirements" },
];

// Secondary small dots — scattered, non-grid
const secondary = [
  { x: 200, y: 70, r: 4 },
  { x: 340, y: 60, r: 4 },
  { x: 184, y: 178, r: 4 },
  { x: 358, y: 168, r: 4 },
  { x: 50, y: 220, r: 4 },
  { x: 498, y: 218, r: 4 },
  { x: 250, y: 340, r: 4 },
  { x: 372, y: 364, r: 4 },
  { x: 156, y: 268, r: 4 },
];

// Index map: 0 = hero, 1..4 primary, 5..13 secondary
const allNodes = [hero, ...primary, ...secondary];

// Edges — organic mesh, not every pair. Hero is well-connected (current year anchor)
const edges = [
  // Hero to all primaries
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  // Hero to a few nearby secondaries
  [0, 7], // hero — center-left small
  [0, 8], // hero — center-right small
  [0, 11], // hero — bottom-mid
  // Primary <-> secondary organic links
  [1, 5], // Program rules — top mid-left
  [1, 9], // Program rules — far left middle
  [1, 7], // Program rules — center-left small
  [2, 6], // Block templates — top mid-right
  [2, 8], // Block templates — center-right small
  [2, 10], // Block templates — far right middle
  [3, 9], // Constraints — far left middle
  [3, 13], // Constraints — bottom-left small
  [3, 11], // Constraints — bottom-mid
  [4, 10], // Site requirements — far right middle
  [4, 12], // Site requirements — bottom-right small
  [4, 11], // Site requirements — bottom-mid
  // A few cross-links to make it feel like a mesh
  [5, 6], // top mid-left — top mid-right
  [9, 13], // far left middle — bottom-left small
  [10, 12], // far right middle — bottom-right small
];

// SVG layer: lines + dots
const svgLayer = svg(
  "svg",
  {
    viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    width: String(WIDTH),
    height: String(HEIGHT),
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: `${WIDTH}px`,
      height: `${HEIGHT}px`,
    },
  },
  // Edges
  ...edges.map(([a, b]) =>
    svg("line", {
      x1: String(allNodes[a].x),
      y1: String(allNodes[a].y),
      x2: String(allNodes[b].x),
      y2: String(allNodes[b].y),
      stroke: "#d1d5db",
      strokeWidth: "1",
    }),
  ),
  // Secondary dots (light gray)
  ...secondary.map((n) =>
    svg("circle", {
      cx: String(n.x),
      cy: String(n.y),
      r: String(n.r),
      fill: "#9ca3af",
    }),
  ),
  // Primary dots
  ...primary.map((n) =>
    svg("circle", {
      cx: String(n.x),
      cy: String(n.y),
      r: String(n.r),
      fill: n.color,
    }),
  ),
  // Hero glow ring (subtle)
  svg("circle", {
    cx: String(hero.x),
    cy: String(hero.y),
    r: "22",
    fill: "#fbbf24",
    opacity: "0.12",
  }),
  svg("circle", {
    cx: String(hero.x),
    cy: String(hero.y),
    r: "16",
    fill: "#fbbf24",
    opacity: "0.18",
  }),
  // Hero dot itself
  svg("circle", {
    cx: String(hero.x),
    cy: String(hero.y),
    r: String(hero.r),
    fill: hero.color,
  }),
);

// Tagline pill (top center, floating above the constellation)
const tagline = h(
  "div",
  {
    position: "absolute",
    top: "22px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#a16207",
    background: "#fefce8",
    padding: "5px 12px",
    borderRadius: "100px",
    whiteSpace: "nowrap",
    display: "flex",
  },
  "KNOWLEDGE PERSISTS",
);

// Pill style for primary labels
const pillStyle = {
  position: "absolute",
  background: "#fff",
  borderRadius: "100px",
  padding: "4px 10px",
  boxShadow:
    "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  fontSize: "11px",
  fontWeight: 600,
  fontFamily: "Inter, sans-serif",
  color: "#1a1a1a",
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
};

// Offset positions for each primary label
const labelOffsets = [
  { dx: 14, dy: -28 }, // Program rules — top right of dot
  { dx: -112, dy: -28 }, // Block templates — top left
  { dx: 14, dy: 14 }, // Constraints — bottom right
  { dx: -118, dy: 14 }, // Site requirements — bottom left
];

const primaryLabels = primary.map((n, i) =>
  h(
    "div",
    {
      ...pillStyle,
      top: `${n.y + labelOffsets[i].dy}px`,
      left: `${n.x + labelOffsets[i].dx}px`,
    },
    n.label,
  ),
);

// Hero label pill — with amber dot accent
const heroLabel = h(
  "div",
  {
    position: "absolute",
    top: `${hero.y - 46}px`,
    left: `${hero.x - 58}px`,
    background: "#fff",
    borderRadius: "100px",
    padding: "5px 12px 5px 8px",
    boxShadow:
      "0 1px 2px rgba(251,191,36,0.06), 0 4px 12px rgba(251,191,36,0.10)",
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: "Inter, sans-serif",
    color: "#1a1a1a",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  h("div", {
    width: "8px",
    height: "8px",
    borderRadius: "100px",
    background: "#fbbf24",
    boxShadow: "0 0 8px 2px rgba(251,191,36,0.30)",
  }),
  h("span", { display: "flex" }, "Active · 2026"),
);

// Title text (bottom area)
const title = h(
  "div",
  {
    position: "absolute",
    bottom: "26px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "18px",
    fontWeight: 700,
    color: "#1a1a1a",
    whiteSpace: "nowrap",
    display: "flex",
    letterSpacing: "-0.01em",
  },
  "Institutional Continuity",
);

const element = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    fontFamily: "Inter, sans-serif",
    color: "#1a1a1a",
    position: "relative",
  },
  h(
    "div",
    {
      position: "relative",
      width: `${WIDTH}px`,
      height: `${HEIGHT}px`,
      display: "flex",
    },
    svgLayer,
    tagline,
    ...primaryLabels,
    heroLabel,
    title,
  ),
);

export default { element, width: WIDTH, height: HEIGHT };
