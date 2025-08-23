export const createRiskManagementSettingsSlice = () => ({
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
});
