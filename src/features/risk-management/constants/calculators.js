export const COMMON_FIELDS = [
  "buyPrice",
  "sellPrice",
  "qty",
  "pts",
  "amount",
  "percent",
];

export const POSITION_SIZING_FIELDS = [
  "adjustedSl",
  "suggestedQty",
  "lotSize",
  "slPts",
  "riskAmount",
  "riskPercent",
];

const PYRAMIDING_FIELDS = [
  "entryPrice",
  "qtyAdded",
  "avgBuyPrice",
  "atRiskReward",
  "riskAmountPyramiding",
  "riskPercentPyramiding",
];

export const FIELDS = {
  calculator: COMMON_FIELDS,
  target: COMMON_FIELDS,
  stopLoss: COMMON_FIELDS,
  positionSizing: POSITION_SIZING_FIELDS,
  pyramiding: PYRAMIDING_FIELDS,
};

export const SECTION_LABELS = {
  calculator: "Calculator",
  positionSizing: "Position-Sizing",
  target: "Target",
  stopLoss: "Stop-Loss",
  pyramiding: "Pyramiding",
};

export const FIELD_LABELS = {
  riskReward: "Risk/Reward",
  buyPrice: "Buy Price",
  sellPrice: "Sell Price",
  qty: "Qty",
  pts: "Pts",
  amount: "P&L (₹)",
  percent: "P&L (%)",
  slPts: "SL Pts",
  lotSize: "Lot Size",
  suggestedQty: "Suggested Qty",
  riskAmount: "Risk (₹)",
  riskPercent: "Risk (%)",
  adjustedSl: "Adjusted SL",
  entryPrice: "Entry Price",
  qtyAdded: "Qty",
  atRiskReward: "At Risk/Reward",
  riskAmountPyramiding: "Risk (₹)",
  riskPercentPyramiding: "Risk (%)",
  avgBuyPrice: "Avg. Buy Price",
};

export const SECTION_COLOR = {
  calculator: "text-(--text-muted)",
  positionSizing: "text-(--text-muted)",
  target: "text-(--success)",
  stopLoss: "text-(--error)",
  pyramiding: "text-(--text-muted)",
};

export const FIELD_COLORS = {
  riskReward: "var(--text)",
  buyPrice: "var(--success)",
  sellPrice: "var(--error)",
  qty: "var(--text)",
  slPts: "var(--error)",
  lotSize: "var(--text)",
  suggestedQty: "var(--text)",
  riskPercent: "var(--error)",
  riskAmount: "var(--error)",
  adjustedSl: "var(--error)",
};
