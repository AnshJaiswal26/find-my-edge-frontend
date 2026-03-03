import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createUISlice } from "./ui.slice";
import { createChartsSlice } from "./charts.slice";
import { createStatsSlice } from "./stats.slice";

export const useDashboardStore = create(
  immer((set, get) => ({
    isInitialized: false,

    ...createUISlice(set, get),
    ...createStatsSlice(set, get),
    ...createChartsSlice(set, get),
  })),
);
