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

export const numberFormatters = {
  NUMBER: (v, d = 2) => v.toFixed(d),

  INTEGER: (v) => Math.round(v).toString(),

  CURRENCY: (v, d = 0) => `₹${v.toFixed(d)}`,

  CURRENCY_SIGNED: (v, d = 0) =>
    `${v >= 0 ? "+" : "-"}₹${Math.abs(v).toFixed(d)}`,

  PERCENT: (v, d = 0) => `${v.toFixed(d)}%`,

  PERCENT_SIGNED: (v, d = 0) =>
    `${v >= 0 ? "+" : "-"}${Math.abs(v).toFixed(d)}%`,

  RATIO: (v, d = 0) => `1:${v.toFixed(d)}`,

  RATIO_X: (v, d = 2) => `${v.toFixed(d)}x`,

  COMPACT: (v) => {
    if (Math.abs(v) >= 1e7) return `${(v / 1e7).toFixed(1)}Cr`;
    if (Math.abs(v) >= 1e5) return `${(v / 1e5).toFixed(1)}L`;
    if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
    return v.toString();
  },
};
