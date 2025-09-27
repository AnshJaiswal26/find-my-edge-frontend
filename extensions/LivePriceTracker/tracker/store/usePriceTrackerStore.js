import { create } from "zustand";

export const usePriceTrackerStore = create((set) => ({
  strikePrice: "",
  price: 0,
  lastPrice: 0,
  selectedOption: "call",
  isTracking: false,
  isMinimized: false,
  stockSymbol: "BANKNIFTY",

  updateMultipleFields: (updateArray) => {
    set((prev) => {
      const fieldUpdates = {};
      for (const [field, value] of updateArray) {
        if (prev[field] !== value) fieldUpdates[field] = value;
      }
      return Object.keys(fieldUpdates).length === 0
        ? prev
        : { ...prev, ...fieldUpdates };
    });
  },

  updateField: (field, value) => {
    set((prev) => {
      if (field === "price") {
        const prevPrice = prev.price;
        if (prevPrice === value) return prev;
        return { price: value, lastPrice: prevPrice };
      }
      return { [field]: value };
    });
  },
}));
