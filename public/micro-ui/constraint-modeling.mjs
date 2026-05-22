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

// --- Cursor caret SVG (tiny) ---
const cursorSvg = svg(
  "svg",
  {
    viewBox: "0 0 16 20",
    fill: "none",
    width: "12",
    height: "15",
    xmlns: "http://www.w3.org/2000/svg",
  },
  svg("path", {
    d: "M1 1L1 14.5L4.5 11L8.5 18.5L11 17L7 9.5L12 9.5L1 1Z",
    fill: "#92400e",
    stroke: "#92400e",
    strokeWidth: "1.2",
    strokeLinejoin: "round",
  }),
);

// --- Sparkle / play SVG for Compile button ---
const playSvg = svg(
  "svg",
  {
    viewBox: "0 0 16 16",
    fill: "none",
    width: "11",
    height: "11",
    xmlns: "http://www.w3.org/2000/svg",
  },
  svg("path", {
    d: "M4 3L13 8L4 13L4 3Z",
    fill: "#92400e",
    stroke: "#92400e",
    strokeWidth: "1",
    strokeLinejoin: "round",
  }),
);

// --- Check SVG for valid indicator ---
const checkSvg = svg(
  "svg",
  {
    viewBox: "0 0 16 16",
    fill: "none",
    width: "10",
    height: "10",
    xmlns: "http://www.w3.org/2000/svg",
  },
  svg("path", {
    d: "M3 8L6.5 11.5L13 4.5",
    stroke: "#16a34a",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }),
);

// --- Highlight variants ---
const heroHL = (text) =>
  h(
    "span",
    {
      display: "flex",
      padding: "1px 6px",
      borderRadius: "4px",
      fontWeight: 700,
      background: "#fbbf24",
      color: "#78350f",
    },
    text,
  );

const numHL = (text) =>
  h(
    "span",
    {
      display: "flex",
      padding: "1px 6px",
      borderRadius: "4px",
      fontWeight: 700,
      background: "#ede9fe",
      color: "#6d28d9",
      fontVariantNumeric: "tabular-nums",
    },
    text,
  );

const neutralHL = (text) =>
  h(
    "span",
    {
      display: "flex",
      padding: "1px 6px",
      borderRadius: "4px",
      fontWeight: 600,
      background: "#f3f4f6",
      color: "#6b7280",
    },
    text,
  );

const word = (text) => h("span", { display: "flex" }, text);

// --- Header: title + DSL badge ---
const header = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "6px",
  },
  h(
    "div",
    { display: "flex", flexDirection: "column" },
    h(
      "span",
      {
        display: "flex",
        fontSize: "16px",
        fontWeight: 700,
        color: "#1a1a1a",
        letterSpacing: "-0.01em",
      },
      "Custom Constraint",
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
      "PROGRAM-SPECIFIC RULES",
    ),
  ),
  h(
    "span",
    {
      display: "flex",
      alignItems: "center",
      fontSize: "10px",
      fontWeight: 700,
      color: "#6b7280",
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      padding: "3px 9px",
      borderRadius: "100px",
      letterSpacing: "0.06em",
    },
    "DSL v3",
  ),
);

// --- Constraint body paragraph (inline-wrapped) ---
const constraintParagraph = h(
  "div",
  {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: 1.5,
    color: "#1a1a1a",
    marginTop: "18px",
    marginBottom: "20px",
  },
  word("Resident on"),
  heroHL("moonlighting restriction"),
  word("cannot exceed"),
  numHL("16 hours/week"),
  word("outside of"),
  neutralHL("primary site"),
  word("."),
  word("During"),
  neutralHL("parental leave"),
  word(", reassign"),
  neutralHL("continuity clinic"),
  word("to"),
  neutralHL("coverage pool"),
  word("."),
);

// --- Footer action row: cursor + valid indicator + Compile pill ---
const validBadge = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#16a34a",
    background: "#f0fdf4",
    padding: "4px 9px",
    borderRadius: "100px",
    letterSpacing: "0.02em",
  },
  checkSvg,
  h("span", { display: "flex" }, "valid"),
);

const compileBtn = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 16px",
    background: "#fffbeb",
    border: "1.5px solid #fbbf24",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#92400e",
    letterSpacing: "0.02em",
  },
  playSvg,
  h("span", { display: "flex" }, "Compile"),
);

const actionRow = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "4px",
    paddingTop: "16px",
    borderTop: "1px dashed #e5e7eb",
  },
  h(
    "div",
    { display: "flex", alignItems: "center", gap: "10px" },
    cursorSvg,
    validBadge,
  ),
  compileBtn,
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
    padding: "32px",
    transform: "rotate(-1deg)",
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04)",
  },
  header,
  constraintParagraph,
  actionRow,
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

export default { element, width: 540, height: 400 };
