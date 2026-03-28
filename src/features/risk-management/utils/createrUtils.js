import { FIELD_LABELS } from "../constants";
import { useRiskManagementStore } from "@features/risk-management/stores";

export const getKey = (s, f) => `${s}_${f}`;

export const generateTooltip = (field, key, mode) => {
  if (!key) return null;

  const derived =
    mode ?? useRiskManagementStore.getState().settings.derivedInput;

  const fieldHolder = FIELD_LABELS[field];
  const isPriceOrQty =
    field === "buyPrice" || field === "sellPrice" || field === "qty";

  const isAmountLock = derived === "amount";

  const holder = field !== "buyPrice" ? "positive" : "negative";

  const upperCaseOpposite = field === "buyPrice" ? "Sell Price" : "Buy Price";

  const conditionalMsg = {
    negative: isAmountLock ? fieldHolder : "Buy/Sell Price",
    adjust: isAmountLock ? "amount change adjustment" : "derived input",
  };

  const createMessage = () => {
    switch (key) {
      case "zeroCapital":
        return "Enter Capital to calculate returns in %";
      case "negative":
        return `Derived ${fieldHolder} cannot be negative. Increase ${conditionalMsg.negative} or enter ${holder} values in Amount, Pts or Pnl(%) to correct.`;
      case "adjust":
        return `${fieldHolder} cannot be negative. Increase ${fieldHolder} or switch ${conditionalMsg.adjust} back to ${fieldHolder}.`;
      case "less":
        return `${fieldHolder} should be less than the ${upperCaseOpposite}`;
      case "greater":
        return `${fieldHolder} should be greater than the ${upperCaseOpposite}`;
    }
  };

  return {
    key: `${key}_${conditionalMsg[key]}`,
    type: key !== "zeroCapital" ? "error" : "info",
    position: isPriceOrQty ? "top" : "bottom",
    message: createMessage(),
  };
};

export const createMetrics = () => ({
  buyPrice: 0,
  sellPrice: 0,
  qty: 0,
  pts: 0,
  amount: 0,
  percent: 0,
});

export const createInputMetrics = () => ({
  buyPrice: {
    value: 0,
    flash: false,
    tooltip: false,
  },
  sellPrice: {
    value: 0,
    flash: false,
    tooltip: false,
  },
  qty: {
    value: 0,
    flash: false,
    tooltip: false,
  },
  pts: {
    value: 0,
    flash: false,
    tooltip: false,
  },
  percent: {
    value: 0,
    flash: false,
    tooltip: false,
  },
});
