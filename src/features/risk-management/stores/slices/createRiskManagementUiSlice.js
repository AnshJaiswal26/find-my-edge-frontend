export const createRiskManagementUiSlice = () => ({
  currentTab: "normal",
  currentTransaction: "calculator",
  inputPrev: 0,
  isChargesAdded: false,
  isChargesRemoved: false,

  capitalTooltip: { current: null },
  riskRewardTooltip: { ratio: null },
  calculatorTooltip: { buyPrice: null, sellPrice: null },
  targetTooltip: { buyPrice: null, sellPrice: null },
  stopLossTooltip: { buyPrice: null, sellPrice: null },
  anyTooltipActive: null,
});
