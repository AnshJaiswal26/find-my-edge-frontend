export const createRiskManagementUiSlice = () => ({
  currentTab: "normal",
  currentTransaction: "calculator",
  inputPrev: 0,
  isChargesAdded: false,
  isChargesRemoved: false,

  tooltip: {
    capital: null,
    riskReward: null,
    calculator: {
      buyPrice: null,
      sellPrice: null,
    },
    target: {
      buyPrice: null,
      sellPrice: null,
    },
    stopLoss: {
      buyPrice: null,
      sellPrice: null,
    },
    isActive: null,
  },

  capitalTooltip: { current: null },
  riskRewardTooltip: { ratio: null },
  calculatorTooltip: { buyPrice: null, sellPrice: null },
  targetTooltip: { buyPrice: null, sellPrice: null },
  stopLossTooltip: { buyPrice: null, sellPrice: null },
  anyTooltipActive: null,
});
