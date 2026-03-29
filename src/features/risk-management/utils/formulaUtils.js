import { FIELD_LABELS } from "../constants";

export const getFormulaMap = (selected) => ({
  name: selected,
  buyPrice: "Sell Price - Pts",
  sellPrice:
    selected === "riskReward"
      ? "Buy Price + (SL Pts × Risk-Reward)"
      : "Buy Price + Pts",
  pts:
    selected === "riskReward"
      ? "SL Pts × Risk-Reward"
      : selected.includes("Price")
        ? "Sell Price - Buy Price"
        : "Amount / Qty",
  amount:
    selected === "riskReward"
      ? "SL Amount × Risk-Reward"
      : selected === "percent"
        ? "Capital × (Pnl (%) / 100)"
        : "Pts × Qty",
  percent:
    selected === "riskReward"
      ? "SL Pnl(%) × Risk-Reward"
      : "(Amount / Capital) × 100",
});

export const getFormula = (field, { currentSection, affected, formulaMap }) => {
  const oppoSec = currentSection === "Target" ? "SL" : "Target";
  const operator = currentSection === "Target" ? "×" : "/";

  if (affected.length === 6) {
    return field === "buyPrice" || field === "qty"
      ? `from ${oppoSec}`
      : field === "sellPrice"
        ? `Buy Price + (${oppoSec} Pts ${operator} Risk-Reward)`
        : `${oppoSec} ${FIELD_LABELS[field]} ${operator} Risk-Reward`;
  } else return formulaMap[field];
};

export const getPositionSizingFormulaMap = (selected) => ({
  name: selected,

  suggestedQty: "Risk Amount / (SL Pts × Lot Size)",

  slPts: "Risk Amount / Suggested Qty",

  riskAmount:
    selected === "percent"
      ? "Capital × (Risk % / 100)"
      : "SL Pts × Qty × Lot Size",

  riskPercent: "(Risk Amount / Capital) × 100",

  lotSize: "Fixed (Instrument Based)",
});

export const getPositionSizingFormula = (field, { affected, formulaMap }) => {
  // If everything affected → special case
  if (affected.length === 5) {
    return field === "lotSize"
      ? "Fixed Value"
      : "Derived from Risk & SL relationship";
  }

  return formulaMap[field];
};
