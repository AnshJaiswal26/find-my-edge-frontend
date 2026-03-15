import { dashboardApi } from "@features/dashboard/api/dashboard.api";
import { PAGE_CONFIG } from "@pages/config/pageConfig";

export const dashboardService = {
  async init() {
    const response = await dashboardApi.init();
    return response;
  },

  async updateGridLayout(layout) {
    const response = await dashboardApi.updateGridLayout(
      PAGE_CONFIG.DASHBOARD.key,
      layout,
    );
    return response;
  },
};
