import { chartService } from "@features/dashboard/services/chart.service";
import { chartEngine } from "../model/chartEngine";
import { PAGE_CONFIG } from "@pages/config/pageConfig";

export const createLayoutSlice = (set, get) => ({
  async updateLayout(chartId, { layout, seriesById }) {
    set((s) => {
      Object.assign(s.charts[chartId].layout, layout);
      Object.assign(s.charts[chartId].seriesById, seriesById);
    });

    chartEngine.update(chartId);

    await chartService.updateLayout(PAGE_CONFIG.DASHBOARD.key, chartId, {
      layout,
      seriesById,
    });

    get().closePopup();
  },

  toggleLayout(chartId, key) {
    set((s) => {
      s.charts[chartId].layout[key] = !s.charts[chartId].layout[key];
    });
  },
});
