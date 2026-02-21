const NUMBER_FORMATS = [
  { key: "NUMBER", label: "123.45" },
  { key: "NUMBER_SIGNED", label: "+123.45 / -98.7" },

  { key: "INTEGER", label: "123" },

  { key: "CURRENCY", label: "₹1,250" },
  { key: "CURRENCY_SIGNED", label: "+₹450 / -₹300" },

  { key: "PERCENT", label: "12%" },
  { key: "PERCENT_SIGNED", label: "+3.2% / -1.5%" },

  { key: "RATIO", label: "1:2" },
  { key: "RATIO_X", label: "2.5x" },

  { key: "COMPACT_CURRENCY", label: "₹1.2L / ₹120K" },
  { key: "COMPACT_CURRENCY_SIGNED", label: "+₹1.2L / -₹120K" },

  { key: "COMPACT", label: "1.2L / 120K" },
  { key: "COMPACT_SIGNED", label: "+1.2L / -120K" },
];

const NUMBER_FORMAT = {
  NUMBER: "NUMBER",
  NUMBER_SIGNED: "NUMBER_SIGNED",

  INTEGER: "INTEGER",

  CURRENCY: "CURRENCY",
  CURRENCY_SIGNED: "CURRENCY_SIGNED",

  PERCENT: "PERCENT",
  PERCENT_SIGNED: "PERCENT_SIGNED",

  RATIO: "RATIO",
  RATIO_X: "RATIO_X",

  COMPACT_CURRENCY: "COMPACT_CURRENCY",
  COMPACT_CURRENCY_SIGNED: "COMPACT_CURRENCY_SIGNED",

  COMPACT: "COMPACT",
  COMPACT_SIGNED: "COMPACT_SIGNED",
};

const NUMBER_FORMAT_KEYS = NUMBER_FORMATS.map(({ key }) => key);

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

function formatCompact(v, { symbol = "", signed = false } = {}) {
  const abs = Math.abs(v);
  const sign = signed ? (v >= 0 ? "+" : "-") : "";

  if (abs >= 1e7) return `${sign}${symbol}${formatNumber(abs / 1e7, 1)}Cr`;
  if (abs >= 1e5) return `${sign}${symbol}${formatNumber(abs / 1e5, 1)}L`;
  if (abs >= 1e3) return `${sign}${symbol}${formatNumber(abs / 1e3, 1)}K`;

  return signed
    ? `${sign}${symbol}${formatNumber(abs, 0)}`
    : `${symbol}${formatNumber(v, 0)}`;
}
const numberFormatters = {
  NUMBER: (v, d = 2) => formatNumber(v, d),

  NUMBER_SIGNED: (v, d = 2) =>
    `${v >= 0 ? "+" : "-"}${formatNumber(Math.abs(v), d)}`,

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

  COMPACT: (v) => formatCompact(v),

  COMPACT_SIGNED: (v) => formatCompact(v, { signed: true }),

  COMPACT_CURRENCY: (v) => formatCompact(v, { symbol: "₹" }),

  COMPACT_CURRENCY_SIGNED: (v) =>
    formatCompact(v, { symbol: "₹", signed: true }),
};

export { NUMBER_FORMATS, NUMBER_FORMAT, NUMBER_FORMAT_KEYS, numberFormatters };
