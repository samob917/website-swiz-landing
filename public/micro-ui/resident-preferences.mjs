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

// ---------- Header (title + tagline pill) ----------
const headerEl = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
  },
  h(
    "span",
    {
      fontSize: "15px",
      fontWeight: 700,
      color: "#1a1a1a",
      letterSpacing: "-0.01em",
    },
    "Preference Integration",
  ),
  h(
    "span",
    {
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.1em",
      color: "#a16207",
      background: "#fefce8",
      padding: "4px 9px",
      borderRadius: "100px",
    },
    "FIRST-CLASS INPUTS",
  ),
);

// ---------- Avatar circle ----------
function avatar({ initials, bg, color, size = 32, fontSize = 12 }) {
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: bg,
      color,
      fontSize: `${fontSize}px`,
      fontWeight: 700,
      flexShrink: 0,
      letterSpacing: "0.02em",
    },
    initials,
  );
}

// ---------- Message 1 (resident, left) ----------
const residentBubble = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    background: "#f3f4f6",
    padding: "12px 14px",
    borderRadius: "14px 14px 14px 4px",
    maxWidth: "300px",
  },
  h(
    "span",
    {
      fontSize: "13px",
      fontWeight: 500,
      color: "#1a1a1a",
      lineHeight: 1.45,
    },
    "Need Mar 14-21 off — conference. Also half-day Wed.",
  ),
);

const residentRow = h(
  "div",
  {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
  },
  avatar({
    initials: "RP",
    bg: "#e5e7eb",
    color: "#4b5563",
    size: 32,
    fontSize: 11,
  }),
  h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "4px",
    },
    residentBubble,
    h(
      "span",
      {
        fontSize: "11px",
        fontWeight: 500,
        color: "#9ca3af",
        marginLeft: "4px",
      },
      "9:42 AM",
    ),
  ),
);

// ---------- Chip badge (green check + label) ----------
function chipBadge(label) {
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      background: "#f0fdf4",
      border: "1px solid #bbf7d0",
      borderRadius: "100px",
      padding: "4px 9px 4px 7px",
    },
    svg(
      "svg",
      {
        width: "10",
        height: "10",
        viewBox: "0 0 10 10",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
      },
      svg("path", {
        d: "M2 5.2l2 2 4-4.4",
        stroke: "#16a34a",
        strokeWidth: "1.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      }),
    ),
    h(
      "span",
      {
        fontSize: "11px",
        fontWeight: 600,
        color: "#15803d",
        letterSpacing: "0.01em",
      },
      label,
    ),
  );
}

// ---------- Message 2 (SW, right, amber accent) ----------
const swBubble = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    border: "1px solid #fcd34d",
    padding: "12px 14px",
    borderRadius: "14px 14px 4px 14px",
    maxWidth: "280px",
    boxShadow: "0 1px 2px rgba(251,191,36,0.06), 0 4px 10px rgba(251,191,36,0.08)",
  },
  h(
    "span",
    {
      fontSize: "13px",
      fontWeight: 500,
      color: "#1a1a1a",
      lineHeight: 1.45,
    },
    "Logged 2 preferences. Both fit current optimization.",
  ),
);

const chipsRow = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  chipBadge("Conference · Mar 14-21"),
  chipBadge("Clinic · Wed half"),
);

const swColumn = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
    maxWidth: "320px",
  },
  swBubble,
  chipsRow,
);

const swRow = h(
  "div",
  {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: "10px",
  },
  swColumn,
  avatar({
    initials: "SW",
    bg: "#fbbf24",
    color: "#78350f",
    size: 28,
    fontSize: 10,
  }),
);

// ---------- Bottom reaction row ----------
const reactionRow = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginTop: "16px",
    paddingTop: "14px",
    borderTop: "1px solid #f3f4f6",
  },
  h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      background: "#16a34a",
      flexShrink: 0,
    },
    svg(
      "svg",
      {
        width: "10",
        height: "10",
        viewBox: "0 0 10 10",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
      },
      svg("path", {
        d: "M2 5.2l2 2 4-4.4",
        stroke: "#fff",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      }),
    ),
  ),
  h(
    "span",
    {
      fontSize: "11px",
      fontWeight: 600,
      color: "#15803d",
      letterSpacing: "0.04em",
    },
    "Added to optimizer",
  ),
);

// ---------- Card ----------
const mainCard = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    borderRadius: "20px",
    padding: "28px",
    width: "440px",
    transform: "rotate(-0.6deg)",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  },
  headerEl,
  h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    residentRow,
    swRow,
  ),
  reactionRow,
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
    padding: "24px",
    fontFamily: "Inter, sans-serif",
    color: "#1a1a1a",
  },
  mainCard,
);

export default { element, width: 520, height: 420 };
