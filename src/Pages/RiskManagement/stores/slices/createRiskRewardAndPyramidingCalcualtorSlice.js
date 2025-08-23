import { createMetrics } from "@RM/utils";

export const createRiskRewardAndPyramidingCalculatorSlice = () => ({
  riskReward: {
    name: "riskReward",
    ratio: 0,
    prevRatio: 0,
  },

  target: {
    name: "target",
    ...createMetrics(),
  },

  stopLoss: {
    name: "stopLoss",
    ...createMetrics(),
  },

  pyramiding: {
    name: "pyramiding",
    riskIncrement: "Fix",
    at: "priceAchieved",
    layer: 0,
  },

  pyramidingTable: {
    headers: [
      "Layer",
      "Entry Price",
      "Qty Added",
      "At Risk/Reward",
      "Risk Per Layer",
      "Cumulative Risk",
      "Avg Buy Price",
    ],
    rows: [
      {
        entryPrice: 0,
        qtyAdded: 0,
        atRiskReward: 0,
        riskAmountPyramiding: 0,
        riskPercentPyramiding: 0,
        cummulativeRiskPercent: 0,
        cummulativeRiskAmount: 0,
        avgBuyPrice: 0,
      },
    ],
  },
});
