import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createUISlice } from "./ui.slice";
import { createCoreSlice } from "./core.slice";

export const useTradeSetupStore = create(
  immer((set, get) => ({
    ...createUISlice(set, get),
    ...createCoreSlice(set, get),
    isLoading: false,
  })),
);
