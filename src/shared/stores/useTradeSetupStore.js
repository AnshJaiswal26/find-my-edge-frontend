import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useTradeStore = create(
  immer((set, get) => ({
    tradeSetups: [
      {
        name: "",
        imageUrl: "",
        imagePublicId: "",
        fieldOrder: [],
        fieldsById: {},
      },
    ],

    isLoading: false,
  })),
);
