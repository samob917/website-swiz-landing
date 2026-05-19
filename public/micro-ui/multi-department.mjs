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

// --- Tokens ---
const COLOR = {
  text: "#1a1a1a",
  secondary: "#6b7280",
  muted: "#9ca3af",
  border: "#e5e7eb",
  amber: "#fbbf24",
  amberDark: "#d97706",
  amberInk: "#78350f",
  card: "#ffffff",
};

// --- Hex geometry: flat-top hex ---
const R = 34;
const W = R * 2; // 68
const H = Math.round(R * Math.sqrt(3)); // ~59

function hexPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    pts.push(
      `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`,
    );
  }
  return pts.join(" ");
}

// Flat-top grid: col spacing = W * 0.75, row spacing = H
// odd columns shift down by H/2
const cols = 5;
const rows = 4;
const colSpacing = W * 0.75; // 51
const rowSpacing = H; // 59

// SVG canvas size for the grid
const padding = 20;
const gridWidth = Math.round((cols - 1) * colSpacing + W + padding * 2);
const gridHeight = Math.round(
  rows * rowSpacing + rowSpacing / 2 + padding * 2 - 14,
);

const gridOriginX = padding + R;
const gridOriginY = padding + R - 4;

function hexCenter(col, row) {
  const x = gridOriginX + col * colSpacing;
  const y =
    gridOriginY + row * rowSpacing + (col % 2 === 1 ? rowSpacing / 2 : 0);
  return { x, y };
}

// Build all cells: for odd columns, one fewer row to keep top/bottom even
const allCells = [];
for (let c = 0; c < cols; c++) {
  const maxRow = c % 2 === 1 ? rows - 1 : rows;
  for (let r = 0; r < maxRow; r++) {
    allCells.push({ col: c, row: r });
  }
}

// Active hexes (department initials). Picked positions to make a clustered, central pattern.
const activeMap = {
  "0,1": "IM",
  "1,0": "EM",
  "1,2": "SUR",
  "2,1": "PED",
  "2,2": "OB",
  "3,0": "ANE",
  "3,2": "RAD",
  "4,1": "CAR",
};

// The centermost active hex glows
const glowKey = "2,1";

// --- SVG hex polygons (drawn first, full grid) ---
const hexPolygons = allCells.map((cell) => {
  const key = `${cell.col},${cell.row}`;
  const { x, y } = hexCenter(cell.col, cell.row);
  const active = activeMap[key];

  if (active) {
    return svg("polygon", {
      points: hexPoints(x, y, R - 1),
      fill: COLOR.amber,
      stroke: COLOR.amberDark,
      strokeWidth: "1.5",
    });
  }
  // Inactive: outline only, subtle gray fill on some
  const subtle = (cell.col + cell.row) % 2 === 0;
  return svg("polygon", {
    points: hexPoints(x, y, R - 1),
    fill: subtle ? "rgba(107,114,128,0.04)" : "#ffffff",
    stroke: "#9ca3af",
    strokeWidth: "1.5",
    strokeOpacity: "0.55",
  });
});

const hexSvg = svg(
  "svg",
  {
    viewBox: `0 0 ${gridWidth} ${gridHeight}`,
    width: `${gridWidth}`,
    height: `${gridHeight}`,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: {
      position: "absolute",
      top: "0",
      left: "0",
      width: `${gridWidth}px`,
      height: `${gridHeight}px`,
    },
  },
  ...hexPolygons,
);

// --- Label overlay (positioned absolutely over each active hex) ---
function activeLabel(col, row, text) {
  const { x, y } = hexCenter(col, row);
  const key = `${col},${row}`;
  const isGlow = key === glowKey;
  const boxSize = 40;
  return h(
    "div",
    {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      left: `${x - boxSize / 2}px`,
      top: `${y - boxSize / 2}px`,
      width: `${boxSize}px`,
      height: `${boxSize}px`,
      borderRadius: "50%",
      boxShadow: isGlow
        ? "0 0 24px 6px rgba(251,191,36,0.22), 0 0 10px 2px rgba(251,191,36,0.18)"
        : "none",
    },
    h(
      "span",
      {
        display: "flex",
        fontSize: "11px",
        fontWeight: 700,
        color: COLOR.amberInk,
        letterSpacing: "0.04em",
        lineHeight: "1",
      },
      text,
    ),
  );
}

const labelOverlays = Object.entries(activeMap).map(([key, text]) => {
  const [c, r] = key.split(",").map(Number);
  return activeLabel(c, r, text);
});

// --- Honeycomb container (absolute-positioned children over SVG) ---
const honeycomb = h(
  "div",
  {
    position: "relative",
    display: "flex",
    width: `${gridWidth}px`,
    height: `${gridHeight}px`,
  },
  hexSvg,
  ...labelOverlays,
);

// --- Title block (above the honeycomb) ---
const titleBlock = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  h(
    "span",
    {
      display: "flex",
      fontSize: "10px",
      fontWeight: 700,
      color: COLOR.amberDark,
      letterSpacing: "0.18em",
    },
    "SYSTEM-WIDE",
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "18px",
      fontWeight: 700,
      color: COLOR.text,
      letterSpacing: "-0.01em",
    },
    "Multi-Department",
  ),
);

// --- Floating pill below the grid ---
const pill = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    background: COLOR.card,
    borderRadius: "100px",
    border: `1px solid ${COLOR.border}`,
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  },
  h("div", {
    display: "flex",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: COLOR.amber,
    boxShadow: "0 0 8px 1px rgba(251,191,36,0.35)",
  }),
  h(
    "span",
    {
      display: "flex",
      fontSize: "12px",
      fontWeight: 600,
      color: COLOR.text,
      letterSpacing: "0.01em",
    },
    "8 departments",
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "12px",
      fontWeight: 500,
      color: COLOR.muted,
    },
    "·",
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "12px",
      fontWeight: 600,
      color: COLOR.secondary,
      letterSpacing: "0.01em",
    },
    "1 schedule",
  ),
);

// --- Root ---
const element = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    gap: "12px",
    fontFamily: "Inter, sans-serif",
    color: COLOR.text,
  },
  titleBlock,
  honeycomb,
  pill,
);

export default { element, width: 520, height: 440 };
