/* eslint-disable react-refresh/only-export-components */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import {
  createRiskManagementUiSlice,
  createPositionSizingAndCalculatorSlice,
  createRiskRewardAndPyramidingCalculatorSlice,
  createUpdaterSlice,
} from "./slices";

export const useRiskManagementStore = create(
  immer((set) => ({
    ui: {},

    capital: {
      name: "capital",
      current: 0,
      prevVal: 0,
    },

    settings: {
      showPanel: false,

      //Calculation Accuracy
      autoRound: false,
      roundMode: "Approx",

      // Derived Input
      derivedInput: "sellPrice",
      adjustedField: "sellPrice",

      //Round Qty
      roundQtyTo: "Nearest",

      //Logic Guide
      selectedField: "buyPrice",

      //Selected Section
      selectedSection: "Calculator",
    },

    ...createRiskManagementUiSlice(),
    ...createPositionSizingAndCalculatorSlice(),
    ...createRiskRewardAndPyramidingCalculatorSlice(),

    ...createUpdaterSlice(set),

    updateStore: set,
  }))
);

// refator version that i think to change
// calculators: {
//   capital: {
//     name: "capital",
//     value: 0,
//     flash: false,
//     tooltip: false,
//   },

//   riskReward: {
//     name: "riskReward",
//     value: 0,
//     flash: false,
//     tooltip: false,
//     prevRatio: 0,
//   },

//   charges: {
//     name: "charges",
//     ...createInputMetrics(),
//   },

//   target: {
//     name: "target",
//     ...createInputMetrics(),
//   },

//   stopLoss: {
//     name: "stopLoss",
//     ...createInputMetrics(),
//   },
// },
