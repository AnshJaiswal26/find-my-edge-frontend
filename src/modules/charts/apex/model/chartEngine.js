import ChartInstance from "./chartInstance";

class ChartEngine {
  charts = new Map();
  datasets = new Map();
  listeners = new Map();

  /* ---------------- EVENTS ---------------- */

  on(event, cb) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(cb);

    return () => {
      this.listeners.get(event)?.delete(cb);
    };
  }

  emit(event, payload) {
    this.listeners.get(event)?.forEach((cb) => cb(payload));
  }

  /* ---------------- CHART LIFECYCLE ---------------- */
  create(container, chartId, store) {
    const chart = new ChartInstance(container, chartId, store);

    this.charts.set(chartId, chart);

    this.emit("chart:init", chartId);
  }

  render(chartId) {
    this.charts.get(chartId)?.render();
  }

  destroy(chartId) {
    this.charts.get(chartId)?.destroy();
    this.charts.delete(chartId);

    this.datasets.delete(chartId);

    this.emit("chart:destroy", chartId);
  }

  remove(chartId) {
    this.emit("chart:remove", chartId);
  }

  updateLayout(chartId) {
    this.charts.get(chartId)?.updateLayout();
  }

  get(chartId) {
    return this.charts.get(chartId);
  }

  getGroups(chartId) {
    return (
      this.charts.get(chartId)?.getGroups() ?? {
        groups: [],
        currentGroupIndex: 0,
      }
    );
  }

  showGroup(chartId, index) {
    this.charts.get(chartId)?.showGroup(index);
  }

  update(chartId) {
    this.charts.get(chartId)?.update();
  }

  getDataset(chartId) {
    return this.datasets.get(chartId);
  }

  setDataset(chartId, dataset) {
    const chart = this.charts.get(chartId);

    if (this.datasets.has(chartId)) {
      const existingDataset = this.datasets.get(chartId);

      if (chart) {
        chart.setDataset(existingDataset);
      }

      return;
    }

    this.datasets.set(chartId, dataset);

    if (chart) {
      chart.setDataset(dataset);
    }
  }

  updateDataset(chartId, dataset) {
    if (this.datasets.has(chartId)) return;

    this.datasets.set(chartId, dataset);

    const chart = this.charts.get(chartId);
    if (chart) chart.setDataset(dataset);
  }

  mergeDataset(chartId, partialDataset) {
    const currentDataset = this.datasets.get(chartId);

    if (!currentDataset) return;

    const nextDataset = {
      ...currentDataset,
      ...partialDataset,
    };

    this.datasets.set(chartId, nextDataset);

    const chart = this.charts.get(chartId);
    if (chart) {
      chart.setDataset(nextDataset);
    }

    this.emit("dataset:merge", chartId);
  }
}

export const chartEngine = new ChartEngine();
