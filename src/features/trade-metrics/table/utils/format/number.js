export const NUMBER_FORMATS = [
  { key: "NUMBER", label: "123.45" },
  { key: "INTEGER", label: "123" },

  { key: "CURRENCY", label: "₹1,250" },
  { key: "CURRENCY_SIGNED", label: "+₹450 / -₹300" },

  { key: "PERCENT", label: "12%" },
  { key: "PERCENT_SIGNED", label: "+3.2% / -1.5%" },

  { key: "RATIO", label: "1:2" },
  { key: "RATIO_X", label: "2.5x" },

  { key: "COMPACT", label: "1.2L / 120K" },
];

function formatNumber(v, d = 2) {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(v);
}

function formatCurrency(v, d = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(v);
}

export const numberFormatters = {
  NUMBER: (v, d = 2) => formatNumber(v, d),

  INTEGER: (v) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Math.round(v)),

  CURRENCY: (v, d = 0) => formatCurrency(v, d),

  CURRENCY_SIGNED: (v, d = 0) =>
    `${v >= 0 ? "+" : "-"}${formatCurrency(Math.abs(v), d)}`,

  PERCENT: (v, d = 0) => `${formatNumber(v, d)}%`,

  PERCENT_SIGNED: (v, d = 0) =>
    `${v >= 0 ? "+" : "-"}${formatNumber(Math.abs(v), d)}%`,

  RATIO: (v, d = 0) => `1:${formatNumber(v, d)}`,

  RATIO_X: (v, d = 2) => `${formatNumber(v, d)}x`,

  COMPACT: (v) => {
    const abs = Math.abs(v);

    if (abs >= 1e7) return `${formatNumber(v / 1e7, 1)}Cr`;
    if (abs >= 1e5) return `${formatNumber(v / 1e5, 1)}L`;
    if (abs >= 1e3) return `${formatNumber(v / 1e3, 1)}K`;

    return formatNumber(v, 0);
  },
};
