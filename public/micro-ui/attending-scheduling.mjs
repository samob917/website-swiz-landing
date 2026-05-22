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
  surface: "#f3f4f6",
  card: "#ffffff",
  amber: "#fbbf24",
  amberSoft: "#fef3c7",
  amberInk: "#92400e",
};

const CARD_SHADOW =
  "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)";

const CARD_WIDTH = 320;

// --- Avatar (initials "DR") ---
const avatar = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundImage:
      "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 55%, #fbbf24 140%)",
    color: "#1a1a1a",
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.02em",
    flexShrink: 0,
  },
  "DR",
);

// --- Profile header: avatar + name/role + badge ---
const nameBlock = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginLeft: "12px",
    marginRight: "10px",
  },
  h(
    "span",
    {
      fontSize: "15px",
      fontWeight: 700,
      color: COLOR.text,
      lineHeight: "1.2",
    },
    "Dr. R. Chen",
  ),
  h(
    "span",
    {
      fontSize: "11px",
      fontWeight: 500,
      color: COLOR.secondary,
      marginTop: "3px",
      lineHeight: "1.2",
    },
    "Cardiology · Attending",
  ),
);

const onServiceBadge = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    background: COLOR.amber,
    color: "#1a1a1a",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    padding: "5px 10px",
    borderRadius: "100px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  "On Service",
);

const profileHeader = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  avatar,
  nameBlock,
  onServiceBadge,
);

// --- Stats row ---
function stat(value, label, opts) {
  const o = opts || {};
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      flex: 1,
    },
    h(
      "span",
      {
        fontSize: "22px",
        fontWeight: 800,
        lineHeight: "1.2",
        color: o.hero ? COLOR.amber : COLOR.text,
        fontVariantNumeric: "tabular-nums",
      },
      value,
    ),
    h(
      "span",
      {
        fontSize: "11px",
        fontWeight: 500,
        color: COLOR.muted,
        marginTop: "4px",
        lineHeight: "1.2",
      },
      label,
    ),
  );
}

const statsRow = h(
  "div",
  {
    display: "flex",
    gap: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #f3f4f6",
  },
  stat("18d", "On service"),
  stat("2", "Cross-cover"),
  stat("100%", "Coverage", { hero: true }),
);

// --- Front card ---
function frontCard() {
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      width: `${CARD_WIDTH}px`,
      background: COLOR.card,
      borderRadius: "20px",
      padding: "22px 22px 20px",
      boxShadow: CARD_SHADOW,
    },
    profileHeader,
    statsRow,
  );
}

// --- Ghost cards stacked behind ---
// Approximate the front card's shape so the stack reads clearly without
// repeating all internal content.
function ghostCard(opts) {
  const o = opts || {};
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: `${o.top || 0}px`,
      left: `${o.left || 0}px`,
      width: `${CARD_WIDTH}px`,
      height: "150px",
      background: COLOR.card,
      borderRadius: "20px",
      padding: "22px",
      opacity: o.opacity,
      transform: `rotate(${o.rotate}deg)`,
      boxShadow: CARD_SHADOW,
    },
    // faux header line
    h(
      "div",
      {
        display: "flex",
        alignItems: "center",
        marginBottom: "18px",
      },
      h("div", {
        display: "flex",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#f3f4f6",
        flexShrink: 0,
      }),
      h("div", {
        display: "flex",
        width: "110px",
        height: "10px",
        borderRadius: "100px",
        background: "#f3f4f6",
        marginLeft: "12px",
      }),
    ),
    // faux stats line
    h(
      "div",
      {
        display: "flex",
        gap: "16px",
        paddingTop: "14px",
        borderTop: "1px solid #f3f4f6",
      },
      h("div", {
        display: "flex",
        flex: 1,
        height: "24px",
        borderRadius: "6px",
        background: "#f3f4f6",
      }),
      h("div", {
        display: "flex",
        flex: 1,
        height: "24px",
        borderRadius: "6px",
        background: "#f3f4f6",
      }),
      h("div", {
        display: "flex",
        flex: 1,
        height: "24px",
        borderRadius: "6px",
        background: "#f3f4f6",
      }),
    ),
  );
}

// --- "+ 14 more" pill ---
const morePill = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "-14px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#1a1a1a",
    color: "#ffffff",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    padding: "6px 12px",
    borderRadius: "100px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  "+ 14 more attendings",
);

// --- Stack wrapper ---
// Order matters in Satori (no z-index): paint ghosts first, then front card,
// then the "more" pill on top.
const stack = h(
  "div",
  {
    display: "flex",
    position: "relative",
    width: `${CARD_WIDTH + 40}px`,
    height: "230px",
    alignItems: "center",
    justifyContent: "center",
  },
  // farthest back
  ghostCard({ top: 14, left: -16, rotate: -5, opacity: 0.4 }),
  // mid
  ghostCard({ top: 8, left: 16, rotate: 4, opacity: 0.6 }),
  // front card, centered via flex on wrapper
  h(
    "div",
    {
      display: "flex",
      position: "absolute",
      top: "20px",
      left: "20px",
    },
    frontCard(),
  ),
  morePill,
);

const root = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    fontFamily: "Inter, sans-serif",
    color: COLOR.text,
    position: "relative",
  },
  stack,
);

export default { element: root, width: 520, height: 440 };
