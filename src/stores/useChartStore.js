import { generateCharts } from "@utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useChartStore = create(
  immer((set) => ({
    chartGridLayout: null,
    activeChart: { id: "", type: "" },

    ...generateCharts(),

    order: [
      { id: "apex-radial-bar-chart-1", type: "radialBar" },
      { id: "apex-line-chart-3", type: "line" },
      { id: "apex-bar-chart-1", type: "bar" },
      { id: "apex-bar-chart-2", type: "bar" },
      { id: "apex-line-chart-1", type: "line" },
      { id: "apex-line-chart-2", type: "line" },
    ],

    updateChart: (chartId, callback) => {
      set((s) => {
        if (typeof chartId === "function") {
          chartId(s);
        } else callback(s[chartId], s);
      });
    },
  }))
);
