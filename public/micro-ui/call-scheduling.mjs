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

// ---------- Header: Title + Month badge ----------
const cardHeader = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "22px",
  },
  h(
    "span",
    {
      fontSize: "18px",
      fontWeight: 700,
      lineHeight: 1.3,
      color: "#1a1a1a",
    },
    "Call Distribution",
  ),
  h(
    "span",
    {
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.04em",
      color: "#6b7280",
      background: "#f3f4f6",
      padding: "4px 10px",
      borderRadius: "100px",
      whiteSpace: "nowrap",
    },
    "JUL · 2026",
  ),
);

// ---------- KPI Stat Boxes ----------
function statBox({ valueColor, value, unit, label, footer }) {
  const valueRow = h(
    "div",
    { display: "flex", alignItems: "baseline" },
    h(
      "span",
      {
        fontSize: "22px",
        fontWeight: 800,
        lineHeight: "1.2",
        color: valueColor,
        fontVariantNumeric: "tabular-nums",
      },
      value,
    ),
    unit
      ? h(
          "span",
          {
            fontSize: "11px",
            fontWeight: 600,
            color: "#9ca3af",
            marginLeft: "4px",
          },
          unit,
        )
      : null,
  );

  const children = [
    valueRow,
    h(
      "span",
      {
        fontSize: "11px",
        fontWeight: 500,
        color: "#9ca3af",
        marginTop: "6px",
        letterSpacing: "0.02em",
      },
      label,
    ),
  ];

  if (footer) children.push(footer);

  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      background: "#fafaf9",
      borderRadius: "14px",
      padding: "14px 14px 14px 14px",
    },
    ...children.filter(Boolean),
  );
}

// Hero stat: avg call load (amber)
const stat1 = statBox({
  valueColor: "#1a1a1a",
  value: "6.2",
  unit: "calls/res",
  label: "Avg call load",
  footer: h(
    "div",
    {
      display: "flex",
      width: "28px",
      height: "3px",
      background: "#fbbf24",
      borderRadius: "2px",
      marginTop: "10px",
    },
  ),
});

// Fairness variance
const stat2 = statBox({
  valueColor: "#1a1a1a",
  value: "0.4",
  unit: "σ",
  label: "Fairness variance",
});

// Duty hour ceiling with subtle bar under it (78/80)
const dutyBar = h(
  "div",
  {
    display: "flex",
    width: "100%",
    height: "4px",
    borderRadius: "2px",
    background: "#f3f4f6",
    marginTop: "8px",
    overflow: "hidden",
  },
  h("div", {
    width: "97.5%",
    height: "100%",
    background: "#16a34a",
    borderRadius: "2px",
  }),
);

const stat3 = statBox({
  valueColor: "#1a1a1a",
  value: "78",
  unit: "h / 80h",
  label: "Duty hour ceiling",
  footer: dutyBar,
});

const statsRow = h(
  "div",
  {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  stat1,
  stat2,
  stat3,
);

// ---------- Segmented bar: per-resident distribution ----------
// 8 residents, similar widths — "fair" distribution
const segments = [
  { w: 12.8, color: "#d1d5db" },
  { w: 12.4, color: "#9ca3af" },
  { w: 13.1, color: "#d1d5db" },
  { w: 12.6, color: "#fbbf24" }, // amber accent for one segment
  { w: 12.5, color: "#9ca3af" },
  { w: 12.7, color: "#d1d5db" },
  { w: 12.4, color: "#9ca3af" },
  { w: 11.5, color: "#d1d5db" },
];

const distributionBar = h(
  "div",
  {
    display: "flex",
    width: "100%",
    height: "10px",
    borderRadius: "5px",
    overflow: "hidden",
    background: "#f3f4f6",
    marginBottom: "12px",
  },
  ...segments.map((s, i) =>
    h("div", {
      width: `${s.w}%`,
      height: "100%",
      background: s.color,
      flexShrink: 0,
      marginRight: i < segments.length - 1 ? "2px" : "0",
    }),
  ),
);

// Legend
const legendDot = h("div", {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: "#1a1a1a",
  flexShrink: 0,
});

const legend = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    fontSize: "11px",
    fontWeight: 500,
    color: "#6b7280",
    lineHeight: "1.3",
  },
  legendDot,
  h(
    "span",
    { marginLeft: "8px", display: "flex" },
    "Balanced across 8 residents",
  ),
);

// ---------- Card ----------
const card = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    width: "440px",
    background: "#fff",
    borderRadius: "20px",
    padding: "32px",
    transform: "rotate(-1deg)",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  },
  cardHeader,
  statsRow,
  distributionBar,
  legend,
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

export default { element, width: 520, height: 360 };
