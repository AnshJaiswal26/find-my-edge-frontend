/* eslint-disable react-refresh/only-export-components */
import { create } from "zustand";
import {
  createRiskManagementUiSlice,
  createPositionSizingAndCalculatorSlice,
  createRiskRewardAndPyramidingCalculatorSlice,
  createUpdaterSlice,
} from "./slices";

export const useRiskManagementStore = create((set) => ({
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
}));
