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

// --- Layout constants ---
const W = 480;
const H = 420;
const CIRCLE_D = 180;
const CIRCLE_R = CIRCLE_D / 2;

const CX = W / 2;
const CY = H / 2;
const SPREAD = 58;

// Brand palette
// Clinic — amber #fbbf24 -> (251,191,36)
// Rotation — violet #7c3aed -> (124,58,237)
// Call — emerald #10b981 -> (16,185,129)
const circles = [
  {
    // Clinic (top)
    cx: CX,
    cy: CY - SPREAD + 4,
    color: [251, 191, 36],
    label: "Clinic",
    labelX: CX - 28,
    labelY: CY - SPREAD - CIRCLE_R - 6,
  },
  {
    // Rotation (bottom-left)
    cx: CX - SPREAD,
    cy: CY + SPREAD - 28,
    color: [124, 58, 237],
    label: "Rotation",
    labelX: CX - SPREAD - CIRCLE_R - 6,
    labelY: CY + SPREAD + CIRCLE_R - 40,
  },
  {
    // Call (bottom-right)
    cx: CX + SPREAD,
    cy: CY + SPREAD - 28,
    color: [16, 185, 129],
    label: "Call",
    labelX: CX + SPREAD + CIRCLE_R - 24,
    labelY: CY + SPREAD + CIRCLE_R - 40,
  },
];

const FONT = "Inter, sans-serif";

// --- Circle elements (translucent radial gradient discs) ---
const circleElements = circles.map(({ cx, cy, color }) =>
  h("div", {
    position: "absolute",
    display: "flex",
    width: `${CIRCLE_D}px`,
    height: `${CIRCLE_D}px`,
    borderRadius: "50%",
    left: `${cx - CIRCLE_R}px`,
    top: `${cy - CIRCLE_R}px`,
    backgroundImage: `radial-gradient(circle, rgba(${color.join(",")},0.28) 0%, rgba(${color.join(",")},0.08) 70%)`,
    border: `1.5px solid rgba(${color.join(",")},0.18)`,
  }),
);

// --- Label pills (white bg, color text, shadow) ---
const labelElements = circles.map(({ label, labelX, labelY, color }) =>
  h(
    "div",
    {
      position: "absolute",
      left: `${labelX}px`,
      top: `${labelY}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px 10px",
      borderRadius: "100px",
      background: "#ffffff",
      boxShadow: `0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(${color.join(",")},0.14)`,
      fontFamily: FONT,
      fontSize: "11px",
      fontWeight: 600,
      color: `rgb(${color.join(",")})`,
      letterSpacing: "0.01em",
    },
    label,
  ),
);

// --- Hero center dot at the triple intersection ---
const DOT_SIZE = 14;
// Visual triple intersection approximately at the centroid of the 3 circle centers
const TRI_CX = (circles[0].cx + circles[1].cx + circles[2].cx) / 3;
const TRI_CY = (circles[0].cy + circles[1].cy + circles[2].cy) / 3;

const centerDot = h("div", {
  position: "absolute",
  display: "flex",
  width: `${DOT_SIZE}px`,
  height: `${DOT_SIZE}px`,
  borderRadius: "50%",
  left: `${TRI_CX - DOT_SIZE / 2}px`,
  top: `${TRI_CY - DOT_SIZE / 2}px`,
  background: "#fbbf24",
  boxShadow:
    "0 0 0 3px rgba(251,191,36,0.12), 0 1px 4px rgba(251,191,36,0.20)",
});

// Soft halo behind dot for extra emphasis (kept subtle)
const centerHalo = h("div", {
  position: "absolute",
  display: "flex",
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  left: `${TRI_CX - 22}px`,
  top: `${TRI_CY - 22}px`,
  backgroundImage:
    "radial-gradient(circle, rgba(251,191,36,0.22) 0%, rgba(251,191,36,0) 70%)",
});

// --- Resolved pill below the dot ---
const resolvedPill = h(
  "div",
  {
    position: "absolute",
    left: `${TRI_CX - 52}px`,
    top: `${TRI_CY + 18}px`,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "100px",
    background: "#ffffff",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.05)",
    fontFamily: FONT,
    fontSize: "11px",
    fontWeight: 600,
    color: "#b45309",
    letterSpacing: "0.01em",
  },
  svg(
    "svg",
    { width: "10", height: "10", viewBox: "0 0 14 14", fill: "none" },
    svg("path", {
      d: "M2.5 7.2l3 3 6-6.4",
      stroke: "#fbbf24",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
  ),
  h("span", { display: "flex" }, "Resolved"),
);

// --- Tagline pill (top-left, small caps style label) ---
const taglinePill = h(
  "div",
  {
    position: "absolute",
    left: "20px",
    top: "20px",
    display: "flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "100px",
    background: "#ffffff",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.05)",
    fontFamily: FONT,
    fontSize: "10px",
    fontWeight: 700,
    color: "#6b7280",
    letterSpacing: "0.08em",
  },
  "X+Y SCHEDULING",
);

// --- Title (top-right or below tagline) ---
const titleLabel = h(
  "div",
  {
    position: "absolute",
    left: "20px",
    top: "48px",
    display: "flex",
    fontFamily: FONT,
    fontSize: "15px",
    fontWeight: 700,
    color: "#1a1a1a",
    letterSpacing: "-0.01em",
  },
  "Clinic Coordination",
);

const element = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    fontFamily: FONT,
  },
  h(
    "div",
    {
      position: "relative",
      width: `${W}px`,
      height: `${H}px`,
      display: "flex",
    },
    taglinePill,
    titleLabel,
    ...circleElements,
    centerHalo,
    centerDot,
    ...labelElements,
    resolvedPill,
  ),
);

export default { element, width: W, height: H };
