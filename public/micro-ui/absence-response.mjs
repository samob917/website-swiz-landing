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

// ---------- Layout constants ----------
// Tree canvas: ~624px wide, drives connectors + node positioning
const CANVAS_W = 624;
const CANVAS_H = 360;
const LEAF_W = 200;
const LEAF_GAP = 12;
// Center x for the root + re-optimize node
const CENTER_X = CANVAS_W / 2;
// Leaf centers (3 across)
const LEAF_CENTERS = [
  CENTER_X - (LEAF_W + LEAF_GAP),
  CENTER_X,
  CENTER_X + (LEAF_W + LEAF_GAP),
];
// Vertical anchors (top y) for connectors
const ROOT_BOTTOM_Y = 72;          // bottom of root node
const REOPT_TOP_Y = 124;           // top of re-optimize node
const REOPT_BOTTOM_Y = 196;        // bottom of re-optimize node
const LEAVES_TOP_Y = 248;          // top of leaf cards

// ---------- SVG connectors (siblings first, then nodes on top) ----------
const connectors = svg(
  "svg",
  {
    viewBox: `0 0 ${CANVAS_W} ${CANVAS_H}`,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    width: String(CANVAS_W),
    height: String(CANVAS_H),
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: `${CANVAS_W}px`,
      height: `${CANVAS_H}px`,
    },
  },
  // Root -> Re-optimize (straight vertical)
  svg("path", {
    d: `M ${CENTER_X} ${ROOT_BOTTOM_Y} L ${CENTER_X} ${REOPT_TOP_Y}`,
    stroke: "#d1d5db",
    strokeWidth: "1.5",
    fill: "none",
    strokeLinecap: "round",
  }),
  // Re-optimize -> three leaves: a small fan with rounded shoulders
  // Center branch
  svg("path", {
    d: `M ${CENTER_X} ${REOPT_BOTTOM_Y} L ${CENTER_X} ${LEAVES_TOP_Y}`,
    stroke: "#d1d5db",
    strokeWidth: "1.5",
    fill: "none",
    strokeLinecap: "round",
  }),
  // Left branch
  svg("path", {
    d: `M ${CENTER_X} ${REOPT_BOTTOM_Y} L ${CENTER_X} ${REOPT_BOTTOM_Y + 14} Q ${CENTER_X} ${REOPT_BOTTOM_Y + 22} ${CENTER_X - 8} ${REOPT_BOTTOM_Y + 22} L ${LEAF_CENTERS[0] + 8} ${REOPT_BOTTOM_Y + 22} Q ${LEAF_CENTERS[0]} ${REOPT_BOTTOM_Y + 22} ${LEAF_CENTERS[0]} ${REOPT_BOTTOM_Y + 30} L ${LEAF_CENTERS[0]} ${LEAVES_TOP_Y}`,
    stroke: "#d1d5db",
    strokeWidth: "1.5",
    fill: "none",
    strokeLinecap: "round",
  }),
  // Right branch
  svg("path", {
    d: `M ${CENTER_X} ${REOPT_BOTTOM_Y} L ${CENTER_X} ${REOPT_BOTTOM_Y + 14} Q ${CENTER_X} ${REOPT_BOTTOM_Y + 22} ${CENTER_X + 8} ${REOPT_BOTTOM_Y + 22} L ${LEAF_CENTERS[2] - 8} ${REOPT_BOTTOM_Y + 22} Q ${LEAF_CENTERS[2]} ${REOPT_BOTTOM_Y + 22} ${LEAF_CENTERS[2]} ${REOPT_BOTTOM_Y + 30} L ${LEAF_CENTERS[2]} ${LEAVES_TOP_Y}`,
    stroke: "#d1d5db",
    strokeWidth: "1.5",
    fill: "none",
    strokeLinecap: "round",
  }),
);

// ---------- Icons ----------
const alertUserIcon = svg(
  "svg",
  {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  },
  svg("circle", {
    cx: "7",
    cy: "5",
    r: "2",
    stroke: "#1a1a1a",
    strokeWidth: "1.4",
    fill: "none",
  }),
  svg("path", {
    d: "M3 12c0-2.2 1.8-4 4-4s4 1.8 4 4",
    stroke: "#1a1a1a",
    strokeWidth: "1.4",
    strokeLinecap: "round",
    fill: "none",
  }),
);

const gearIcon = svg(
  "svg",
  {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  },
  svg("path", {
    d: "M11 7a4 4 0 11-8 0 4 4 0 018 0z",
    stroke: "#92400e",
    strokeWidth: "1.4",
    fill: "none",
  }),
  svg("path", {
    d: "M7 1.5v1.2M7 11.3v1.2M12.5 7h-1.2M2.7 7H1.5M10.9 3.1l-.85.85M3.95 10.05l-.85.85M10.9 10.9l-.85-.85M3.95 3.95l-.85-.85",
    stroke: "#92400e",
    strokeWidth: "1.4",
    strokeLinecap: "round",
    fill: "none",
  }),
);

const swapIcon = svg(
  "svg",
  {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  },
  svg("path", {
    d: "M2 4h7L7 2M10 8H3l2 2",
    stroke: "#0d9488",
    strokeWidth: "1.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
  }),
);

const backupIcon = svg(
  "svg",
  {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  },
  svg("path", {
    d: "M6 1.5L1.5 3.5v3c0 2.5 1.9 4.4 4.5 5 2.6-.6 4.5-2.5 4.5-5v-3L6 1.5z",
    stroke: "#4f46e5",
    strokeWidth: "1.4",
    strokeLinejoin: "round",
    fill: "none",
  }),
);

const crossCoverIcon = svg(
  "svg",
  {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  },
  svg("path", {
    d: "M3 3h6v6H3z",
    stroke: "#6b7280",
    strokeWidth: "1.4",
    fill: "none",
  }),
  svg("path", {
    d: "M6 1v2M6 9v2M1 6h2M9 6h2",
    stroke: "#6b7280",
    strokeWidth: "1.4",
    strokeLinecap: "round",
  }),
);

// ---------- Card header ----------
const headerDot = h("div", {
  display: "flex",
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: "#fbbf24",
});

const header = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  h(
    "div",
    { display: "flex", alignItems: "center", gap: "8px" },
    headerDot,
    h(
      "span",
      { fontSize: "14px", fontWeight: 700, color: "#1a1a1a" },
      "Coverage options",
    ),
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.06em",
      color: "#6b7280",
      background: "#f3f4f6",
      padding: "4px 10px",
      borderRadius: "100px",
      textTransform: "uppercase",
    },
    "Auto-generated",
  ),
);

// ---------- Root node: "Resident absent" ----------
const todayBadge = h(
  "span",
  {
    display: "flex",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#dc2626",
    background: "#fee2e2",
    padding: "3px 8px",
    borderRadius: "100px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  "Today",
);

const ROOT_W = 260;
const rootNode = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "10px 14px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 10px rgba(0,0,0,0.04)",
    position: "absolute",
    left: `${CENTER_X - ROOT_W / 2}px`,
    top: "20px",
    width: `${ROOT_W}px`,
  },
  h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "26px",
      height: "26px",
      borderRadius: "8px",
      background: "#f3f4f6",
      flexShrink: 0,
    },
    alertUserIcon,
  ),
  h(
    "span",
    {
      flex: 1,
      fontSize: "13px",
      fontWeight: 600,
      color: "#1a1a1a",
      whiteSpace: "nowrap",
    },
    "Resident absent",
  ),
  todayBadge,
);

// ---------- Re-optimize node (amber hero) ----------
const REOPT_W = 260;
const reoptimizeNode = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "14px",
    padding: "12px 16px",
    boxShadow:
      "0 1px 2px rgba(251,191,36,0.06), 0 4px 12px rgba(251,191,36,0.10)",
    position: "absolute",
    left: `${CENTER_X - REOPT_W / 2}px`,
    top: `${REOPT_TOP_Y}px`,
    width: `${REOPT_W}px`,
  },
  h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "28px",
      height: "28px",
      borderRadius: "8px",
      background: "#fbbf24",
      flexShrink: 0,
    },
    gearIcon,
  ),
  h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    h(
      "span",
      {
        fontSize: "13px",
        fontWeight: 700,
        color: "#92400e",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      },
      "Re-optimize",
    ),
    h(
      "span",
      {
        fontSize: "10px",
        fontWeight: 600,
        color: "#a16207",
        marginTop: "2px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      },
      "Rapid pass",
    ),
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.06em",
      color: "#92400e",
      background: "#fde68a",
      padding: "3px 8px",
      borderRadius: "100px",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    },
    "3 paths",
  ),
);

// ---------- Leaf cards ----------
function badge(text, variant) {
  const palette = {
    avail: { color: "#16a34a", bg: "#f0fdf4" },
    backup: { color: "#6b7280", bg: "#f3f4f6" },
  }[variant];
  return h(
    "span",
    {
      display: "flex",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.06em",
      color: palette.color,
      background: palette.bg,
      padding: "3px 8px",
      borderRadius: "100px",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    },
    text,
  );
}

function leafCard(iconNode, iconBg, title, sub, badgeNode, leftX) {
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "14px",
      padding: "12px 14px",
      gap: "8px",
      width: `${LEAF_W}px`,
      boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 4px 10px rgba(0,0,0,0.04)",
      position: "absolute",
      left: `${leftX - LEAF_W / 2}px`,
      top: `${LEAVES_TOP_Y}px`,
    },
    h(
      "div",
      { display: "flex", alignItems: "center", gap: "8px" },
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "22px",
          height: "22px",
          borderRadius: "6px",
          background: iconBg,
          flexShrink: 0,
        },
        iconNode,
      ),
      h(
        "span",
        {
          fontSize: "12px",
          fontWeight: 600,
          color: "#9ca3af",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        },
        sub,
      ),
    ),
    h(
      "div",
      {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
      },
      h(
        "span",
        {
          fontSize: "12px",
          fontWeight: 700,
          color: "#1a1a1a",
        },
        title,
      ),
      badgeNode,
    ),
  );
}

const leafSwap = leafCard(
  swapIcon,
  "#f0fdfa",
  "Dr. Patel",
  "Swap",
  badge("Available", "avail"),
  LEAF_CENTERS[0],
);

const leafBackup = leafCard(
  backupIcon,
  "#eef2ff",
  "Dr. Kim",
  "Backup",
  badge("Available", "avail"),
  LEAF_CENTERS[1],
);

const leafCross = leafCard(
  crossCoverIcon,
  "#f3f4f6",
  "MICU team",
  "Cross-cover",
  badge("Backup", "backup"),
  LEAF_CENTERS[2],
);

// ---------- Tree canvas ----------
const treeCanvas = h(
  "div",
  {
    display: "flex",
    position: "relative",
    width: `${CANVAS_W}px`,
    height: `${CANVAS_H}px`,
  },
  // connectors first (lowest in stacking order)
  connectors,
  // nodes on top
  rootNode,
  reoptimizeNode,
  leafSwap,
  leafBackup,
  leafCross,
);

// ---------- Card ----------
const card = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    width: `${CANVAS_W + 56}px`,
    background: "#fff",
    borderRadius: "20px",
    padding: "28px 28px 24px",
    transform: "rotate(-1deg)",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  },
  header,
  treeCanvas,
);

// ---------- Root ----------
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
  },
  card,
);

export default { element, width: 760, height: 500 };
