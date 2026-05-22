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

const CANVAS_W = 560;
const CANVAS_H = 360;

const tiers = [
  {
    width: 340,
    bg: "#f3f4f6",
    border: "#e5e7eb",
    label: "All shifts needed",
    value: "240",
    valueColor: "#6b7280",
    labelColor: "#6b7280",
    hero: false,
  },
  {
    width: 280,
    bg: "#fef3c7",
    border: "#fde68a",
    label: "Initial coverage",
    value: "232",
    valueColor: "#a16207",
    labelColor: "#6b7280",
    hero: false,
  },
  {
    width: 220,
    bg: "#fde29a",
    border: "#fcd34d",
    label: "After optimization",
    value: "240",
    valueColor: "#a16207",
    labelColor: "#6b7280",
    hero: false,
  },
  {
    width: 160,
    bg: "#fbbf24",
    border: "#f59e0b",
    label: "Fully covered",
    value: "0 gaps",
    valueColor: "#16a34a",
    labelColor: "#92400e",
    hero: true,
  },
];

const barHeight = 36;
const gap = 14;
const totalBarsHeight = tiers.length * barHeight + (tiers.length - 1) * gap;
const startY = (CANVAS_H - totalBarsHeight) / 2;
const cx = CANVAS_W / 2;

function dashedLines() {
  const lines = [];
  for (let i = 0; i < tiers.length - 1; i++) {
    const currentW = tiers[i].width;
    const nextW = tiers[i + 1].width;
    const y1 = startY + i * (barHeight + gap) + barHeight;
    const y2 = y1 + gap;

    // Left dashed connector
    lines.push(
      svg("line", {
        x1: String(cx - currentW / 2),
        y1: String(y1),
        x2: String(cx - nextW / 2),
        y2: String(y2),
        stroke: "#e5e7eb",
        strokeWidth: "1",
        strokeDasharray: "3,3",
      }),
    );
    // Right dashed connector
    lines.push(
      svg("line", {
        x1: String(cx + currentW / 2),
        y1: String(y1),
        x2: String(cx + nextW / 2),
        y2: String(y2),
        stroke: "#e5e7eb",
        strokeWidth: "1",
        strokeDasharray: "3,3",
      }),
    );
  }
  return svg(
    "svg",
    {
      width: String(CANVAS_W),
      height: String(CANVAS_H),
      viewBox: `0 0 ${CANVAS_W} ${CANVAS_H}`,
      xmlns: "http://www.w3.org/2000/svg",
      style: { position: "absolute", top: 0, left: 0 },
    },
    ...lines,
  );
}

function checkIcon() {
  return svg(
    "svg",
    {
      width: "12",
      height: "12",
      viewBox: "0 0 16 16",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
    },
    svg("path", {
      d: "M3 8.2l3 3 7-7",
      stroke: "#16a34a",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
  );
}

function tierRow(tier, index) {
  const y = startY + index * (barHeight + gap);

  const labelChildren = [
    h(
      "span",
      {
        display: "flex",
        fontSize: "12px",
        fontWeight: 500,
        color: tier.labelColor,
        whiteSpace: "nowrap",
      },
      tier.label,
    ),
  ];

  const valueChildren = [];
  if (tier.hero) {
    valueChildren.push(checkIcon());
  }
  valueChildren.push(
    h(
      "span",
      {
        display: "flex",
        fontSize: "13px",
        fontWeight: 700,
        color: tier.valueColor,
        whiteSpace: "nowrap",
      },
      tier.value,
    ),
  );

  // Bar element (centered) with inner label text
  const barInner = h(
    "div",
    {
      display: "flex",
      width: `${tier.width}px`,
      height: `${barHeight}px`,
      background: tier.bg,
      border: `1px solid ${tier.border}`,
      borderRadius: "10px",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: "14px",
    },
    ...labelChildren,
  );

  // Pill positioned to the right of the bar
  const pill = h(
    "div",
    {
      display: "flex",
      position: "absolute",
      left: `${cx + tier.width / 2 + 14}px`,
      alignItems: "center",
      gap: "6px",
      background: "#fff",
      padding: "5px 12px",
      borderRadius: "100px",
      boxShadow:
        "0 1px 2px rgba(0,0,0,0.03), 0 3px 8px rgba(0,0,0,0.04)",
      whiteSpace: "nowrap",
    },
    ...valueChildren,
  );

  return h(
    "div",
    {
      display: "flex",
      position: "absolute",
      top: `${y}px`,
      left: "0px",
      width: `${CANVAS_W}px`,
      height: `${barHeight}px`,
      alignItems: "center",
      justifyContent: "center",
    },
    barInner,
    pill,
  );
}

const element = h(
  "div",
  {
    display: "flex",
    position: "relative",
    width: `${CANVAS_W}px`,
    height: `${CANVAS_H}px`,
    fontFamily: '"Inter", sans-serif',
  },
  dashedLines(),
  ...tiers.map((t, i) => tierRow(t, i)),
);

export default { element, width: CANVAS_W, height: CANVAS_H };
