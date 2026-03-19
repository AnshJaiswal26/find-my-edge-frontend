import { dashboardService } from "../services/dashboard.service";
import { useUIStore } from "@shared/stores";
import { useDashboardStore } from "../store";
import { useChartStore } from "@modules/charts/apex/store";
import { chartEngine } from "@modules/charts/apex/model/chartEngine";
import { TOAST } from "@shared/constants";

export async function dashboardInit() {
  if (useDashboardStore.getState().isInitialized) return;

  try {
    const data = await dashboardService.init();

    console.log("Dashboard init data:", data);

    useDashboardStore.setState((s) => {
      s.statsById = data.statsById;
      s.statsOrder = data.statsOrder;
      s.gridLayout = data.gridLayout;
      s.chartsOrder = data.chartOrder;
      s.isInitialized = true;
    });

    useChartStore.setState((s) => {
      Object.assign((s.charts = data.charts));
    });

    Object.keys(data.groupAggregateChartResult).forEach((chartId) => {
      const result = data.groupAggregateChartResult[chartId];
      if (result?.groupsOrder) {
        const { groupsOrder, groupsById, series } = result;

        chartEngine.setDataset(chartId, {
          ids: groupsOrder,
          seriesSelector: (id, s) => series[id]?.[s.id || s],
          groupSelector: (id) => groupsById?.[id] || null,
        });
      }
    });

    return data;
  } catch (e) {
    useUIStore
      .getState()
      .showToast(TOAST.ERROR, "Error initializing dashboard: " + e.message);
  }
}
