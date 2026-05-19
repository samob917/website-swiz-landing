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

// Layout constants
const W = 560;
const H = 400;
const prismLeft = 200;
const prismTop = 120;
const prismW = 120;
const prismH = 160;

// Prism vertices: triangle pointing right
const pxA = prismLeft; // top-left
const pyA = prismTop;
const pxB = prismLeft; // bottom-left
const pyB = prismTop + prismH;
const pxC = prismLeft + prismW; // right vertex (midpoint)
const pyC = prismTop + prismH / 2;

// Entry / exit points
const entryY = prismTop + prismH / 2;
const entryX = prismLeft;
const exitX = pxC;
const exitY = pyC;

// Beam config — Block is the hero (amber), slightly thicker
const beams = [
  { color: "#fbbf24", label: "Block", angle: -30, hero: true },
  { color: "#7c3aed", label: "Call", angle: -10 },
  { color: "#10b981", label: "Clinic", angle: 10 },
  { color: "#4f46e5", label: "Attending", angle: 30 },
];

const beamLength = 170;

function beamEndpoint(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: exitX + beamLength * Math.cos(rad),
    y: exitY + beamLength * Math.sin(rad),
  };
}

// SVG layer: prism + beams
const svgLayer = svg(
  "svg",
  {
    viewBox: `0 0 ${W} ${H}`,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    width: String(W),
    height: String(H),
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: `${W}px`,
      height: `${H}px`,
    },
  },

  // Defs: prism gradient + glow filter
  svg(
    "defs",
    {},
    svg(
      "linearGradient",
      { id: "prismGrad", x1: "0", y1: "0", x2: "1", y2: "1" },
      svg("stop", { offset: "0%", stopColor: "#ffffff" }),
      svg("stop", { offset: "100%", stopColor: "#f3f4f6" }),
    ),
    svg(
      "filter",
      { id: "glow", x: "-20%", y: "-20%", width: "140%", height: "140%" },
      svg("feGaussianBlur", { stdDeviation: "3", result: "blur" }),
      svg(
        "feMerge",
        {},
        svg("feMergeNode", { in: "blur" }),
        svg("feMergeNode", { in: "SourceGraphic" }),
      ),
    ),
  ),

  // Input beam (thick gray, with subtle glow)
  svg("line", {
    x1: "70",
    y1: String(entryY),
    x2: String(entryX),
    y2: String(entryY),
    stroke: "#9ca3af",
    strokeWidth: "5",
    strokeLinecap: "round",
    filter: "url(#glow)",
  }),

  // Output beams — Block (hero) thicker
  ...beams.map((b) => {
    const end = beamEndpoint(b.angle);
    return svg("line", {
      x1: String(exitX),
      y1: String(exitY),
      x2: String(Math.round(end.x)),
      y2: String(Math.round(end.y)),
      stroke: b.color,
      strokeWidth: b.hero ? "4.5" : "3",
      strokeLinecap: "round",
    });
  }),

  // Prism triangle
  svg("polygon", {
    points: `${pxA},${pyA} ${pxB},${pyB} ${pxC},${pyC}`,
    fill: "url(#prismGrad)",
    stroke: "#d1d5db",
    strokeWidth: "1.5",
    strokeLinejoin: "round",
  }),
);

// Floating label pills at beam endpoints
const labelPills = beams.map((b) => {
  const end = beamEndpoint(b.angle);
  const pillH = 24;
  return h(
    "div",
    {
      position: "absolute",
      left: `${Math.round(end.x) + 6}px`,
      top: `${Math.round(end.y) - pillH / 2}px`,
      background: "#ffffff",
      borderRadius: "12px",
      padding: "4px 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow:
        "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
      fontSize: "11px",
      fontWeight: 600,
      color: b.color,
    },
    b.label,
  );
});

// "Constraint change" pill on the left
const inputPill = h(
  "div",
  {
    position: "absolute",
    left: "16px",
    top: `${entryY - 12}px`,
    background: "#ffffff",
    borderRadius: "12px",
    padding: "4px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
    fontSize: "11px",
    fontWeight: 600,
    color: "#6b7280",
  },
  "Constraint change",
);

const canvas = h(
  "div",
  {
    position: "relative",
    width: `${W}px`,
    height: `${H}px`,
    display: "flex",
  },
  svgLayer,
  inputPill,
  ...labelPills,
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
  canvas,
);

export default { element, width: W, height: H };
