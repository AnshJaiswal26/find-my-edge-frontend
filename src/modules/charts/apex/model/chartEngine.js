import ChartInstance from "./chartInstance";

class ChartEngine {
  charts = new Map();

  create(container, chartId, store, dataset) {
    const chart = new ChartInstance(container, chartId, store, dataset);

    this.charts.set(chartId, chart);
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
