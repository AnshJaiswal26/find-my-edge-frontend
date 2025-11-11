import { generateCharts } from "@utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useChartStore = create(
  immer((set) => ({
    chartGridLayout: null,
    activeChart: { id: "", type: "" },

    ...generateCharts(),

    order: [
      { id: "apex-radial-bar-chart-1", type: "radialBar", category: "group" },
      { id: "apex-pie-chart-1", type: "donut", category: "group" },
      { id: "apex-radar-chart-1", type: "radar", category: "group" },
      { id: "apex-polarArea-chart-1", type: "polarArea", category: "group" },
      { id: "apex-line-chart-3", type: "line", category: "series" },
      { id: "apex-bar-chart-1", type: "bar", category: "series" },
      { id: "apex-bar-chart-2", type: "bar", category: "series" },
      { id: "apex-line-chart-1", type: "line", category: "series" },
      { id: "apex-line-chart-2", type: "line", category: "series" },
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
