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

const checkSvg = svg(
  "svg",
  {
    viewBox: "0 0 14 14",
    fill: "none",
    width: "10",
    height: "10",
    xmlns: "http://www.w3.org/2000/svg",
  },
  svg("path", {
    d: "M3 7.5l2.8 2.8L11 4",
    stroke: "#16a34a",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }),
);

// --- Header ---
const cardHeader = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  h(
    "span",
    {
      fontSize: "18px",
      fontWeight: 700,
      lineHeight: 1.3,
      color: "#1a1a1a",
    },
    "Block Schedule",
  ),
  h(
    "span",
    {
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.02em",
      color: "#6b7280",
      background: "#f3f4f6",
      padding: "4px 10px",
      borderRadius: "100px",
      whiteSpace: "nowrap",
    },
    "AY 2026-27",
  ),
);

// --- Grid ---
const COL_WIDTHS = {
  name: "108px",
  cell: "1",
};

const MONTHS = ["Jul", "Aug", "Sep", "Oct"];

function headerCell(label, isFirst) {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: isFirst ? "flex-start" : "center",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#9ca3af",
    textTransform: "uppercase",
    paddingBottom: "8px",
  };
  if (isFirst) style.width = COL_WIDTHS.name;
  else style.flex = 1;
  return h("div", style, label);
}

const gridHeader = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderBottom: "1px solid #f3f4f6",
    marginBottom: "6px",
  },
  headerCell("Resident", true),
  headerCell(MONTHS[0]),
  headerCell(MONTHS[1]),
  headerCell(MONTHS[2]),
  headerCell(MONTHS[3]),
);

function rotationCell(code, opts) {
  const o = opts || {};
  const isHero = !!o.hero;
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      height: "26px",
      borderRadius: "6px",
      background: isHero ? "#fbbf24" : o.bg || "#fafaf9",
      fontSize: "11px",
      fontWeight: isHero ? 700 : 600,
      color: isHero ? "#1a1a1a" : o.color || "#3f3f46",
    },
    code,
  );
}

function residentNameCell(pgy, name) {
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      width: COL_WIDTHS.name,
      fontSize: "12px",
      fontWeight: 600,
      color: "#1a1a1a",
      height: "26px",
    },
    h(
      "span",
      {
        fontSize: "10px",
        fontWeight: 700,
        color: "#6b7280",
        background: "#f3f4f6",
        padding: "2px 6px",
        borderRadius: "4px",
        marginRight: "8px",
      },
      pgy,
    ),
    h("span", { fontSize: "12px", fontWeight: 600, color: "#1a1a1a" }, name),
  );
}

function row(pgy, name, cells) {
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      paddingTop: "3px",
      paddingBottom: "3px",
    },
    residentNameCell(pgy, name),
    ...cells,
  );
}

// Soft tinted backgrounds for variety, still muted
const C_CARDS = { bg: "#fef3c7", color: "#92400e" }; // very soft amber tint reserved for hero only; use neutral for non-hero
const NEUTRAL_A = { bg: "#fafaf9", color: "#3f3f46" };
const NEUTRAL_B = { bg: "#f3f4f6", color: "#3f3f46" };

const grid = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #f3f4f6",
    padding: "12px 14px",
    marginBottom: "16px",
  },
  gridHeader,
  row("PGY-2", "Smith", [
    rotationCell("Cards", NEUTRAL_A),
    rotationCell("MICU", NEUTRAL_B),
    rotationCell("Amb", NEUTRAL_A),
    rotationCell("Elec", NEUTRAL_B),
  ]),
  row("PGY-2", "Patel", [
    rotationCell("MICU", NEUTRAL_B),
    rotationCell("Cards", { hero: true }),
    rotationCell("Elec", NEUTRAL_B),
    rotationCell("Amb", NEUTRAL_A),
  ]),
  row("PGY-3", "Lin", [
    rotationCell("Amb", NEUTRAL_A),
    rotationCell("Elec", NEUTRAL_B),
    rotationCell("MICU", NEUTRAL_A),
    rotationCell("Cards", NEUTRAL_B),
  ]),
  row("PGY-3", "Okoye", [
    rotationCell("Elec", NEUTRAL_B),
    rotationCell("Amb", NEUTRAL_A),
    rotationCell("Cards", NEUTRAL_B),
    rotationCell("MICU", NEUTRAL_A),
  ]),
);

// --- KPI chips ---
function kpiChip(label, value, opts) {
  const o = opts || {};
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: o.bg || "#fafaf9",
      borderRadius: "100px",
      padding: "6px 12px",
    },
    h(
      "span",
      {
        fontSize: "11px",
        fontWeight: 500,
        color: "#6b7280",
      },
      label,
    ),
    h(
      "span",
      {
        fontSize: "11px",
        fontWeight: 700,
        color: o.valueColor || "#1a1a1a",
      },
      value,
    ),
  );
}

const compliantChip = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#f0fdf4",
    borderRadius: "100px",
    padding: "6px 10px 6px 12px",
  },
  h(
    "span",
    {
      fontSize: "11px",
      fontWeight: 600,
      color: "#16a34a",
    },
    "Compliant",
  ),
  h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      background: "#ffffff",
    },
    checkSvg,
  ),
);

const kpiRow = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  kpiChip("PGY coverage", "100%"),
  kpiChip("Conflicts", "0", { valueColor: "#16a34a" }),
  compliantChip,
);

// --- Card ---
const card = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    width: "456px",
    background: "#fff",
    borderRadius: "20px",
    padding: "28px",
    transform: "rotate(-1deg)",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  },
  cardHeader,
  grid,
  kpiRow,
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
  },
  card,
);

export default { element, width: 540, height: 420 };
