import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createFilterSlice } from "./filter.slice";
import { createSortSlice } from "./sort.slice";

import { createLayoutSlice } from "./layout.slice";
import { createSeriesSlice } from "./series.slice";
import { createCoreSlice } from "./core.slice";
import { createPopupSlice } from "./popup.slice";

export const useChartStore = create(
  immer((set, get) => ({
    activeChart: { id: "", type: "", activePopup: null },
    charts: {},

    ...createCoreSlice(set, get),
    ...createPopupSlice(set, get),
    ...createFilterSlice(set, get),
    ...createSortSlice(set, get),
    ...createLayoutSlice(set, get),
    ...createSeriesSlice(set, get),

    updateChart: (chartId, callback) => {
      set((s) => {
        if (typeof chartId === "function") {
          chartId(s);
        } else callback(s.charts[chartId], s);
      });
    },
  })),
);
