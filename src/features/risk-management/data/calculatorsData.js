export const commonfields = [
  "buyPrice",
  "sellPrice",
  "qty",
  "pts",
  "amount",
  "percent",
];

export const postitionSizingFields = [
  "adjustedSl",
  "suggestedQty",
  "lotSize",
  "slPts",
  "riskAmount",
  "riskPercent",
];

const pyramidingFields = [
  "entryPrice",
  "qtyAdded",
  "avgBuyPrice",
  "atRiskReward",
  "riskAmountPyramiding",
  "riskPercentPyramiding",
];

export const fields = {
  calculator: commonfields,
  target: commonfields,
  stopLoss: commonfields,
  positionSizing: postitionSizingFields,
  pyramiding: pyramidingFields,
};

export const sectionLabels = {
  calculator: "Calculator",
  positionSizing: "Postition-Sizing",
  target: "Target",
  stopLoss: "Stop-Loss",
  pyramiding: "Pyramiding",
};

export const fieldLabels = {
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

export const sectionColor = {
  calculator: "neutral",
  positionSizing: "neutral",
  target: "green",
  stopLoss: "red",
  pyramiding: "neutral",
};

export const fieldColors = {
  riskReward: "neutral",
  buyPrice: "green",
  sellPrice: "red",
  qty: "neutral",
  slPts: "red",
  lotSize: "neutral",
  suggestedQty: "neutral",
  riskPercent: "red",
  riskAmount: "red",
  adjustedSl: "red",
};
