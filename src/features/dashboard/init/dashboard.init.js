import { dashboardService } from "../services/dashboard.service";
import { useUIStore } from "@shared/stores";
import { useDashboardStore } from "../store";
import { useChartStore } from "@modules/charts/apex/store";

export async function dashboardInit() {
  if (useDashboardStore.getState().isInitialized) return;

  try {
    const data = await dashboardService.init();

    useDashboardStore.setState((s) => {
      s.statsById = data.statsById;
      s.statsOrder = data.statsOrder;
      s.chartGridLayout = data.chartGridLayout;
      s.chartsOrder = data.chartOrder;
      s.isInitialized = true;
    });

    useChartStore.setState((s) => {
      Object.assign((s.charts = data.charts));
    });

    return data;
  } catch (e) {
    useUIStore
      .getState()
      .showToast("ERROR", "Error initializing dashboard: " + e.message);
  }
}
