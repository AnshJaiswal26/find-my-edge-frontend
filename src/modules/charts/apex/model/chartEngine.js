import ChartInstance from "./chartInstance";

class ChartEngine {
  charts = new Map();
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
  create(container, chartId, store, dataset) {
    const chart = new ChartInstance(container, chartId, store, dataset);

    this.charts.set(chartId, chart);

    this.emit("chart:init", chartId);
  }

  destroy(chartId) {
    this.charts.get(chartId)?.destroy();
    this.charts.delete(chartId);

    this.emit("chart:destroy", chartId);
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
}

export const chartEngine = new ChartEngine();
