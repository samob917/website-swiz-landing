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

// ---------- Reusable mini-table ----------
// A panel header (label + version pill)
const panelHeader = ({ title, versionLabel, accent, pillBg, pillColor, extraPill }) => {
  const children = [
    h(
      "span",
      {
        display: "flex",
        fontSize: "13px",
        fontWeight: 700,
        color: "#1a1a1a",
        letterSpacing: "-0.01em",
      },
      title,
    ),
    h(
      "div",
      { display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" },
      h(
        "span",
        {
          display: "flex",
          fontSize: "10px",
          fontWeight: 700,
          color: pillColor,
          background: pillBg,
          padding: "3px 8px",
          borderRadius: "100px",
          letterSpacing: "0.02em",
        },
        versionLabel,
      ),
      ...(extraPill ? [extraPill] : []),
    ),
  ];
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      width: "100%",
      marginBottom: "12px",
    },
    ...children,
  );
};

// Column headers row
const headerRow = (color) =>
  h(
    "div",
    {
      display: "flex",
      width: "100%",
      paddingBottom: "6px",
      borderBottom: "1px solid #f3f4f6",
      marginBottom: "6px",
    },
    ...["Mon", "Tue", "Wed", "Thu"].map((day, i) =>
      h(
        "span",
        {
          display: "flex",
          flex: 1,
          fontSize: "10px",
          fontWeight: 600,
          color: color,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          justifyContent: "center",
        },
        day,
      ),
    ),
  );

// A single table cell
const cell = ({ text, bg, color, border, weight, extra }) =>
  h(
    "div",
    {
      display: "flex",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "26px",
      margin: "0 3px",
      background: bg || "#fafaf9",
      border: border || "1px solid #f3f4f6",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: weight || 600,
      color: color || "#1a1a1a",
      ...(extra || {}),
    },
    text,
  );

// A table row of 4 cells
const tableRow = (cells, marginBottom) =>
  h(
    "div",
    {
      display: "flex",
      width: "100%",
      marginBottom: marginBottom != null ? `${marginBottom}px` : "6px",
      paddingLeft: "0px",
      paddingRight: "0px",
    },
    ...cells.map((c) => cell(c)),
  );

// ---------- Back panel (v1 - faded) ----------
const backPanel = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "44px",
    left: "0px",
    width: "340px",
    background: "#fff",
    borderRadius: "18px",
    padding: "18px",
    transform: "rotate(-3deg)",
    opacity: 0.5,
    border: "1px solid #f3f4f6",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  },
  panelHeader({
    title: "Schedule",
    versionLabel: "v1 · Aug 8",
    pillBg: "#ede9fe",
    pillColor: "#6d28d9",
  }),
  headerRow("#d1d5db"),
  tableRow([
    { text: "Day", color: "#9ca3af" },
    { text: "Day", color: "#9ca3af" },
    { text: "OFF", color: "#9ca3af" },
    { text: "Night", color: "#9ca3af" },
  ]),
  tableRow([
    { text: "Call", color: "#9ca3af" },
    { text: "Day", color: "#9ca3af" },
    { text: "Day", color: "#9ca3af" },
    { text: "OFF", color: "#9ca3af" },
  ]),
  tableRow(
    [
      { text: "OFF", color: "#9ca3af" },
      { text: "Night", color: "#9ca3af" },
      { text: "Day", color: "#9ca3af" },
      { text: "Day", color: "#9ca3af" },
    ],
    0,
  ),
);

// ---------- Mid panel (intermediate) ----------
const midPanel = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "26px",
    left: "30px",
    width: "340px",
    background: "#fff",
    borderRadius: "18px",
    padding: "18px",
    transform: "rotate(-1.5deg)",
    opacity: 0.78,
    border: "1px solid #f3f4f6",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  },
  panelHeader({
    title: "Schedule",
    versionLabel: "v1.5 · Aug 11",
    pillBg: "#ede9fe",
    pillColor: "#6d28d9",
  }),
  headerRow("#9ca3af"),
  tableRow([
    { text: "Day", color: "#6b7280" },
    { text: "Day", color: "#6b7280" },
    { text: "OFF", color: "#6b7280" },
    { text: "Night", color: "#6b7280" },
  ]),
  tableRow([
    { text: "Call", color: "#6b7280" },
    { text: "Day", color: "#6b7280" },
    { text: "Day", color: "#6b7280" },
    { text: "OFF", color: "#6b7280" },
  ]),
  tableRow(
    [
      { text: "OFF", color: "#6b7280" },
      { text: "Night", color: "#6b7280" },
      { text: "Day", color: "#6b7280" },
      { text: "Day", color: "#6b7280" },
    ],
    0,
  ),
);

// ---------- Front panel (v2 - active, with highlighted cell) ----------
const revisedTag = h(
  "span",
  {
    display: "flex",
    fontSize: "9px",
    fontWeight: 700,
    color: "#92400e",
    background: "#fef3c7",
    padding: "2px 6px",
    borderRadius: "100px",
    marginLeft: "4px",
    letterSpacing: "0.04em",
  },
  "REVISED",
);

const changesPill = h(
  "span",
  {
    display: "flex",
    alignItems: "center",
    fontSize: "10px",
    fontWeight: 700,
    color: "#92400e",
    background: "#fef3c7",
    padding: "3px 8px",
    borderRadius: "100px",
    letterSpacing: "0.02em",
  },
  "+ 1 change",
);

const frontHeader = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: "12px",
  },
  h(
    "span",
    {
      display: "flex",
      fontSize: "13px",
      fontWeight: 700,
      color: "#1a1a1a",
      letterSpacing: "-0.01em",
    },
    "Schedule · v2",
  ),
  h(
    "div",
    { display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" },
    h(
      "span",
      {
        display: "flex",
        fontSize: "10px",
        fontWeight: 700,
        color: "#6d28d9",
        background: "#ede9fe",
        padding: "3px 8px",
        borderRadius: "100px",
        letterSpacing: "0.02em",
      },
      "v2 · Aug 14",
    ),
    changesPill,
  ),
);

// The revised cell row with amber highlight on Wed
const revisedRow = h(
  "div",
  {
    display: "flex",
    width: "100%",
    marginBottom: "6px",
    alignItems: "center",
  },
  cell({
    text: "Call",
    bg: "#fafaf9",
    color: "#1a1a1a",
  }),
  cell({
    text: "Day",
    bg: "#fafaf9",
    color: "#1a1a1a",
  }),
  // Highlighted/revised cell
  h(
    "div",
    {
      display: "flex",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: "26px",
      margin: "0 3px",
      background: "#fffbeb",
      border: "1.5px solid #fbbf24",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: 700,
      color: "#92400e",
    },
    "SICK",
  ),
  cell({
    text: "OFF",
    bg: "#fafaf9",
    color: "#1a1a1a",
  }),
);

const frontPanel = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "8px",
    left: "60px",
    width: "340px",
    background: "#fff",
    borderRadius: "18px",
    padding: "18px",
    transform: "rotate(0deg)",
    border: "1px solid #ececec",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  },
  frontHeader,
  headerRow("#6b7280"),
  tableRow([
    { text: "Day", color: "#1a1a1a" },
    { text: "Day", color: "#1a1a1a" },
    { text: "OFF", color: "#1a1a1a" },
    { text: "Night", color: "#1a1a1a" },
  ]),
  revisedRow,
  tableRow(
    [
      { text: "OFF", color: "#1a1a1a" },
      { text: "Night", color: "#1a1a1a" },
      { text: "Day", color: "#1a1a1a" },
      { text: "Day", color: "#1a1a1a" },
    ],
    8,
  ),
  // Footer hint row
  h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      width: "100%",
      paddingTop: "10px",
      borderTop: "1px solid #f3f4f6",
    },
    h("div", {
      display: "flex",
      width: "8px",
      height: "8px",
      borderRadius: "100px",
      background: "#fbbf24",
      marginRight: "8px",
    }),
    h(
      "span",
      {
        display: "flex",
        fontSize: "10px",
        fontWeight: 600,
        color: "#6b7280",
        letterSpacing: "0.01em",
      },
      "Wed regenerated · rest preserved",
    ),
  ),
);

// ---------- Scene ----------
const scene = h(
  "div",
  {
    display: "flex",
    position: "relative",
    width: "420px",
    height: "320px",
  },
  backPanel,
  midPanel,
  frontPanel,
);

const element = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    fontFamily: 'Inter, sans-serif',
    color: "#1a1a1a",
    position: "relative",
  },
  scene,
);

export default { element, width: 520, height: 420 };
