import { dashboardApi } from "@features/dashboard/api/dashboard.api";

export const dashboardService = {
  async init() {
    const response = await dashboardApi.init();
    return response;
  },
};