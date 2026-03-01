import { apiFetch } from "@lib/api/client";
import { useTradeStore, useUIStore } from "@shared/stores";
import { useDashboardStore } from "../store";
import { useChartStore } from "@modules/charts/apex/store";
import { useTableStore } from "@features/trade-metrics/table/store";

export async function dashboardInit() {
  try {
    const data = await apiFetch(`/api/dashboard/init`);

    console.log("Dashboard init data:", data);

    useTradeStore.setState((s) => {
      s.tradesById = data.tradesById;
      s.derivedByTradeId = data.derivedByTradeId;
      s.tradesOrder = data.tradesOrder;

      s.schemasById = data.schemasById;
      s.schemasOrder = data.schemasOrder;
    });

    useTableStore.setState((s) => {
      s.columnsOrder = data.schemasOrder;
    });

    useDashboardStore.setState((s) => {
      s.statsById = data.statsById;
      s.statsOrder = data.statsOrder;

      s.chartGridLayout = data.chartGridLayout;

      s.chartsOrder = data.chartOrder;
    });

    useChartStore.setState((s) => {
      s.charts = data.charts;
    });

    return data;
  } catch (e) {
    useUIStore
      .getState()
      .showToast("ERROR", "Error initializing dashboard: " + e.message);
  }
}
