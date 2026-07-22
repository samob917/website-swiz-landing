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

// --- Traffic light dots ---
const trafficDots = h(
  "div",
  { display: "flex", alignItems: "center", gap: "8px" },
  h("div", {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#ff5f56",
  }),
  h("div", {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#ffbd2e",
  }),
  h("div", {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#27c93f",
  }),
);

// --- Live pulse dot for "running" status ---
const livePulse = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#27c93f",
  },
);

// --- Title bar ---
const titleBar = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    background: "#ececec",
    borderBottom: "1px solid #dcdcdc",
  },
  trafficDots,
  h(
    "div",
    {
      display: "flex",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginLeft: "-60px",
    },
    livePulse,
    h(
      "span",
      {
        display: "flex",
        fontSize: "12px",
        fontWeight: 600,
        color: "#4b5563",
        letterSpacing: "0.01em",
      },
      "acgme-compliance",
    ),
    h(
      "span",
      {
        display: "flex",
        fontSize: "12px",
        fontWeight: 500,
        color: "#9ca3af",
      },
      "·",
    ),
    h(
      "span",
      {
        display: "flex",
        fontSize: "12px",
        fontWeight: 500,
        color: "#6b7280",
      },
      "running",
    ),
  ),
);

// --- Header row inside body ---
const bodyHeader = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  h(
    "div",
    { display: "flex", flexDirection: "column" },
    h(
      "span",
      {
        display: "flex",
        fontSize: "14px",
        fontWeight: 700,
        color: "#1a1a1a",
        letterSpacing: "0.01em",
      },
      "Compliance Engine",
    ),
    h(
      "span",
      {
        display: "flex",
        fontSize: "10px",
        fontWeight: 600,
        color: "#9ca3af",
        letterSpacing: "0.12em",
        marginTop: "3px",
      },
      "ACGME RULES",
    ),
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "10px",
      fontWeight: 600,
      color: "#6b7280",
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      padding: "3px 8px",
      borderRadius: "100px",
      letterSpacing: "0.06em",
    },
    "v2026.1",
  ),
);

// --- Pass badge ---
function passBadge() {
  return h(
    "span",
    {
      display: "flex",
      alignItems: "center",
      fontSize: "10px",
      fontWeight: 700,
      color: "#16a34a",
      background: "#f0fdf4",
      padding: "2px 7px",
      borderRadius: "4px",
      letterSpacing: "0.04em",
    },
    "✓ PASS",
  );
}

// --- Check row ---
function checkRow(name, timing, opts) {
  const o = opts || {};
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      paddingTop: "6px",
      paddingBottom: "6px",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: "0.01em",
    },
    h(
      "span",
      {
        display: "flex",
        width: "14px",
        color: "#9ca3af",
        fontSize: "12px",
        fontWeight: 600,
      },
      "▸",
    ),
    h(
      "span",
      {
        display: "flex",
        width: "48px",
        color: "#6b7280",
        fontSize: "12px",
        fontWeight: 500,
      },
      "check",
    ),
    h(
      "span",
      {
        display: "flex",
        flex: 1,
        color: o.amber ? "#b45309" : "#1a1a1a",
        background: o.amber ? "#fef3c7" : "transparent",
        padding: o.amber ? "2px 6px" : "2px 0",
        borderRadius: o.amber ? "4px" : "0",
        marginRight: "8px",
        fontSize: "12px",
        fontWeight: o.amber ? 700 : 500,
        letterSpacing: "0.01em",
      },
      name,
    ),
    passBadge(),
    h(
      "span",
      {
        display: "flex",
        width: "44px",
        justifyContent: "flex-end",
        color: "#9ca3af",
        fontSize: "11px",
        fontWeight: 500,
        marginLeft: "10px",
        letterSpacing: "0.01em",
      },
      timing,
    ),
  );
}

// --- Check list ---
const checks = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
  },
  checkRow("80h-weekly-limit", "12ms"),
  checkRow("24h-shift-cap", "8ms"),
  checkRow("post-call-rest", "14ms"),
  checkRow("home-call-hours", "11ms", { amber: true }),
  checkRow("weekend-spacing", "9ms"),
);

// --- Separator ---
const separator = h("div", {
  display: "flex",
  height: "1px",
  background: "#e5e7eb",
  marginTop: "10px",
  marginBottom: "10px",
});

// --- Summary row ---
const summaryRow = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    paddingTop: "4px",
    paddingBottom: "4px",
  },
  h(
    "span",
    {
      display: "flex",
      alignItems: "center",
      fontSize: "11px",
      fontWeight: 800,
      color: "#16a34a",
      background: "#f0fdf4",
      padding: "4px 10px",
      borderRadius: "6px",
      letterSpacing: "0.06em",
      marginRight: "12px",
    },
    "✓ PASS",
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "12px",
      fontWeight: 600,
      color: "#1a1a1a",
      letterSpacing: "0.01em",
    },
    "5 checks",
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "12px",
      fontWeight: 500,
      color: "#9ca3af",
      marginLeft: "8px",
      marginRight: "8px",
    },
    "·",
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "12px",
      fontWeight: 600,
      color: "#1a1a1a",
      letterSpacing: "0.01em",
    },
    "0 violations",
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "12px",
      fontWeight: 500,
      color: "#9ca3af",
      marginLeft: "8px",
      marginRight: "8px",
    },
    "·",
  ),
  h(
    "span",
    {
      display: "flex",
      fontSize: "12px",
      fontWeight: 600,
      color: "#6b7280",
      letterSpacing: "0.01em",
    },
    "54ms",
  ),
);

// --- Footer caption ---
const footerCaption = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    marginTop: "14px",
    paddingTop: "12px",
    borderTop: "1px dashed #e5e7eb",
  },
  h(
    "span",
    {
      display: "flex",
      fontSize: "11px",
      fontWeight: 500,
      color: "#9ca3af",
      letterSpacing: "0.01em",
      lineHeight: "1.4",
    },
    "Rules enforced at generation — violations prevented, not detected.",
  ),
);

// --- Terminal body ---
const terminalBody = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    padding: "18px 22px 20px",
    background: "#fafaf9",
  },
  bodyHeader,
  checks,
  separator,
  summaryRow,
  footerCaption,
);

// --- Terminal window (the container itself) ---
const terminal = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    width: "496px",
    background: "#fafaf9",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  },
  titleBar,
  terminalBody,
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
  terminal,
);

export default { element, width: 560, height: 420 };
