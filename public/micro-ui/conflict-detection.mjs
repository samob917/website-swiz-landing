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

const chipShadow =
  "0 1px 2px rgba(0,0,0,0.03), 0 4px 10px rgba(0,0,0,0.04)";

// ---------- Tiny chip icons ----------
function chipIcon(variant) {
  const colorMap = {
    rotation: { bg: "#eef2ff", color: "#4f46e5" },
    call: { bg: "#f3f4f6", color: "#6b7280" },
    clinic: { bg: "#f3f4f6", color: "#6b7280" },
    conf: { bg: "#f3f4f6", color: "#6b7280" },
    pto: { bg: "#f3f4f6", color: "#6b7280" },
  };
  const paths = {
    rotation: svg("path", {
      d: "M3 8a5 5 0 019-3M13 8a5 5 0 01-9 3M11 4v2h2M5 12V10H3",
      stroke: "currentColor",
      strokeWidth: "1.4",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
    call: svg("path", {
      d: "M4 3h2l1.2 3-1.6 1A7 7 0 009.5 10.4l1-1.6L13.5 10v2c0 .8-.7 1.5-1.5 1.5A9 9 0 013 4.5C3 3.7 3.7 3 4.5 3z",
      stroke: "currentColor",
      strokeWidth: "1.4",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    }),
    clinic: [
      svg("rect", {
        x: "2.5",
        y: "3.5",
        width: "11",
        height: "10",
        rx: "1.2",
        stroke: "currentColor",
        strokeWidth: "1.4",
      }),
      svg("path", {
        d: "M8 6v5M5.5 8.5h5",
        stroke: "currentColor",
        strokeWidth: "1.4",
        strokeLinecap: "round",
      }),
    ],
    conf: [
      svg("circle", {
        cx: "8",
        cy: "6",
        r: "2.2",
        stroke: "currentColor",
        strokeWidth: "1.4",
      }),
      svg("path", {
        d: "M3.5 13c0-2.2 2-3.6 4.5-3.6S12.5 10.8 12.5 13",
        stroke: "currentColor",
        strokeWidth: "1.4",
        strokeLinecap: "round",
      }),
    ],
    pto: [
      svg("path", {
        d: "M3 6.5L8 3l5 3.5V13H3z",
        stroke: "currentColor",
        strokeWidth: "1.4",
        strokeLinejoin: "round",
      }),
      svg("path", {
        d: "M6.5 13V9h3v4",
        stroke: "currentColor",
        strokeWidth: "1.4",
        strokeLinejoin: "round",
      }),
    ],
  };
  const s = colorMap[variant];
  const iconChildren = Array.isArray(paths[variant])
    ? paths[variant]
    : [paths[variant]];

  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "22px",
      height: "22px",
      borderRadius: "6px",
      flexShrink: 0,
      background: s.bg,
      color: s.color,
    },
    svg(
      "svg",
      {
        width: "13",
        height: "13",
        viewBox: "0 0 16 16",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        color: s.color,
      },
      ...iconChildren,
    ),
  );
}

function chip(iconVariant, label, sub, rotateDeg) {
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "#fff",
      borderRadius: "12px",
      padding: "8px 12px",
      boxShadow: chipShadow,
      transform: rotateDeg ? `rotate(${rotateDeg}deg)` : undefined,
    },
    chipIcon(iconVariant),
    h(
      "div",
      { display: "flex", flexDirection: "column" },
      h(
        "span",
        {
          fontSize: "11px",
          fontWeight: 600,
          color: "#1a1a1a",
          lineHeight: 1.2,
        },
        label,
      ),
      sub
        ? h(
            "span",
            {
              fontSize: "10px",
              fontWeight: 500,
              color: "#9ca3af",
              marginTop: "2px",
              lineHeight: 1.2,
            },
            sub,
          )
        : null,
    ),
  );
}

// ---------- Row 1: floating chips ----------
const chipsRowA = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  chip("rotation", "Rotation", "Cards", -2),
  chip("call", "Call", "Wed", 1.5),
  chip("clinic", "Clinic", "Half-day", -1),
);

const chipsRowB = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "6px",
  },
  chip("conf", "Conference", null, 2),
  chip("pto", "PTO request", null, -1.5),
);

const chipCluster = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  chipsRowA,
  chipsRowB,
);

// ---------- Connecting dots ----------
function dot(size, color) {
  return h("div", {
    display: "flex",
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  });
}

const connectorDots = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  dot(3, "#e5e7eb"),
  dot(4, "#d1d5db"),
  dot(5, "#9ca3af"),
  dot(4, "#d1d5db"),
  dot(3, "#e5e7eb"),
);

// ---------- Engine / scanning bar (amber hero) ----------
const scanningBar = h(
  "div",
  {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "100px",
    padding: "10px 22px",
    boxShadow:
      "0 1px 2px rgba(251,191,36,0.06), 0 4px 12px rgba(251,191,36,0.10)",
  },
  h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      background: "#fbbf24",
      color: "#fff",
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
        d: "M3 2l4 3-4 3z",
        fill: "#fff",
      }),
    ),
  ),
  h(
    "span",
    {
      fontSize: "13px",
      fontWeight: 700,
      color: "#92400e",
      letterSpacing: "0.01em",
    },
    "Scanning for conflicts",
  ),
  h(
    "span",
    {
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "#a16207",
      background: "#fde68a",
      padding: "3px 8px",
      borderRadius: "100px",
    },
    "PRE-PUBLISH SCAN",
  ),
);

// ---------- Result rows ----------
function resultRow(status, label) {
  const isOk = status === "ok";
  const iconBg = isOk ? "#16a34a" : "#dc2626";
  const badgeBg = isOk ? "#f0fdf4" : "#fee2e2";
  const badgeColor = isOk ? "#16a34a" : "#dc2626";
  const badgeText = isOk ? "OK" : "CONFLICT";

  const iconMark = isOk
    ? svg("path", {
        d: "M3 7l3 3 5-6",
        stroke: "#fff",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      })
    : svg("path", {
        d: "M4 4l6 6M10 4l-6 6",
        stroke: "#fff",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        fill: "none",
      });

  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "#fff",
      borderRadius: "12px",
      padding: "10px 14px",
      boxShadow: chipShadow,
    },
    h(
      "div",
      {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: iconBg,
        flexShrink: 0,
      },
      svg(
        "svg",
        {
          width: "14",
          height: "14",
          viewBox: "0 0 14 14",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
        },
        iconMark,
      ),
    ),
    h(
      "span",
      {
        flex: 1,
        fontSize: "12px",
        fontWeight: 600,
        color: "#1a1a1a",
      },
      label,
    ),
    h(
      "span",
      {
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        color: badgeColor,
        background: badgeBg,
        padding: "3px 9px",
        borderRadius: "100px",
        flexShrink: 0,
      },
      badgeText,
    ),
  );
}

const resultsCol = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "320px",
  },
  resultRow("conflict", "Call vs. Conference"),
  resultRow("conflict", "Clinic vs. Rotation"),
  resultRow("ok", "PTO accepted"),
);

// ---------- Root ----------
const element = h(
  "div",
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    gap: "14px",
    padding: "24px",
    fontFamily: "Inter, sans-serif",
    color: "#1a1a1a",
  },
  chipCluster,
  connectorDots,
  scanningBar,
  resultsCol,
);

export default { element, width: 520, height: 440 };
