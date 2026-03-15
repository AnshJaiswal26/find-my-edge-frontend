import { useChartStore } from "@modules/charts/apex/store";
import { PAGE_CONFIG } from "@pages/config/pageConfig";
import { chartService } from "../services/chart.service";

const deleteQueue = new Map();

function debounceDelete(chartId) {
  if (deleteQueue.has(chartId)) {
    clearTimeout(deleteQueue.get(chartId));
  }

  const timer = setTimeout(() => {
    chartService.delete(PAGE_CONFIG.DASHBOARD.key, chartId);
    deleteQueue.delete(chartId);
  }, 500);

  deleteQueue.set(chartId, timer);
}

export const createChartsSlice = (set, get) => ({
  chartsOrder: [],

  addChart: async (payload, { onError } = {}) => {
    const { closePopup } = get();

    try {
      const { chart, chartResult } = await chartService.create(
        PAGE_CONFIG.DASHBOARD.key,
        payload,
      );

      useChartStore.setState((s) => {
        s.charts[chart.id] = chart;
      });

      set((s) => {
        s.chartsOrder.push(chart.id);
      });

      closePopup();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create chart";

      onError?.(msg);
    }
  },

  deleteChart(chartId) {
    // update UI immediately
    useChartStore.setState((s) => {
      delete s.charts[chartId];
    });

    set((s) => {
      s.chartsOrder = s.chartsOrder.filter((id) => id !== chartId);
      delete s.chartGridLayout?.[chartId];
    });

    debounceDelete(chartId);
  },
});
