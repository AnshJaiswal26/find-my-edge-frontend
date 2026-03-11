import ChartInstance from "./chartInstance";

class ChartEngine {
  charts = new Map();

  create(container, chartId, store, dataset) {
    const chart = new ChartInstance(container, chartId, store, dataset);

    this.charts.set(chartId, chart);
  }

  patch(chartId, patch) {
    const chart = this.charts.get(chartId);
    if (!chart) return;

    if (patch.filters) chart.applyFilters(patch.filters);
    if (patch.sort) chart.applySort(patch.sort);
    if (patch.layout) chart.updateLayout(patch.layout);
    if (patch.series) chart.updateSeriesConfig(patch.series);
    if (patch.selection) chart.applySelection(patch.selection);
  }

  get(chartId) {
    return this.charts.get(chartId);
  }

  update(chartId) {
    this.charts.get(chartId)?.update();
  }

  destroy(chartId) {
    this.charts.get(chartId)?.destroy();
    this.charts.delete(chartId);
  }
}

export const chartEngine = new ChartEngine();
