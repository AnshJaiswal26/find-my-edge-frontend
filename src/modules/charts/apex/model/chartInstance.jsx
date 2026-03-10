import ApexCharts from "apexcharts";
import {
  evaluateColorRules,
  FILTER_OPERATION_MAP,
  SORT_OPERATION_MAP,
} from "@shared/utils";

import { seriesTooltipCallback } from "../tooltip/series.tooltip";
import { buildLineChartOptions, buildBarChartOptions } from "../options";

export default class ChartInstance {
  constructor(container, chartId, store, dataset) {
    this.container = container;
    this.chartId = chartId;
    this.store = store;
    this.dataset = dataset;

    this.seriesSelector = dataset.seriesSelector;
    this.groupSelector = dataset.groupSelector;

    this.render();

    this.setupResizeListener();
  }

  get chart() {
    return this.store.getState().charts[this.chartId];
  }

  /* =========================
     LIFECYCLE
  ========================= */

  render() {
    const ids = this.dataset.ids;

    const finalIds = this.computeIds(ids);

    const series = this.computeSeries(finalIds);

    const options = this.buildOptions(finalIds);

    this.apex = new ApexCharts(this.container, {
      ...options,
      series,
    });

    this.apex.render();
  }

  update() {
    const ids = this.dataset.ids;

    const finalIds = this.computeIds(ids);

    const series = this.computeSeries(finalIds);

    const options = this.buildOptions(finalIds);

    this.apex.updateOptions(options, false, true);
    this.apex.updateSeries(series, true);
  }

  destroy() {
    window.removeEventListener("chart-resize", this.resizeListener);
    this.apex?.destroy();
  }

  setupResizeListener() {
    this.resizeListener = (e) => {
      if (e.detail?.chartId === this.chartId) {
        this.apex?.resize();
      }
    };

    window.addEventListener("chart-resize", this.resizeListener);
  }

  /* =========================
     DATA PIPELINE
  ========================= */

  computeIds(ids) {
    const { filters, sort, selection } = this.chart;

    let result = ids;

    /* FILTER */

    if (filters?.length) {
      result = result.filter((id) =>
        filters.some((f) => {
          const fn = FILTER_OPERATION_MAP[f.operator];
          const value = this.seriesSelector(id, f.key);
          return fn?.(value, f.value ?? f.from, f.to);
        }),
      );
    }

    /* SORT */

    if (sort?.key && sort.operator !== "none") {
      const fn = SORT_OPERATION_MAP[sort.operator];

      result = [...result].sort((a, b) => {
        const v1 = this.seriesSelector(a, sort.key);
        const v2 = this.seriesSelector(b, sort.key);
        return fn?.(v1, v2) ?? 0;
      });
    }

    /* SELECTION */

    if (selection?.from !== null && selection?.to !== null) {
      result = result.slice(selection.from, selection.to);
    }

    return result;
  }

  computeSeries(ids) {
    const { series, type } = this.chart;

    return series.map((s) => ({
      name: s.label,

      data: ids.map((id) => this.seriesSelector(id, s.field)),

      color:
        type === "line"
          ? s.color
          : ({ value }) => evaluateColorRules(value, s.colorRules)?.color,
    }));
  }

  /* =========================
     TOOLTIP
  ========================= */

  buildTooltip(ids) {
    const { selectedSeriesIds } = this.chart;

    return (seriesValue, index, seriesIndex) =>
      seriesTooltipCallback({
        seriesValue,
        index,
        seriesIndex,
        chartId: this.chartId,
        getTitle: (field) => this.seriesSelector(ids[index], field),
        selectedSeriesIds,
      });
  }

  /* =========================
     OPTIONS BUILDER
  ========================= */

  buildOptions(ids) {
    const params = {
      ids,
      type: this.chart.type,
      chartId: this.chartId,
      layout: this.chart.layout,
      seriesSelector: this.seriesSelector,
      series: this.chart.series,
      mode: this.chart.mode,
      xMetric: this.chart.xMetric,
      groupSelector: this.groupSelector,
      tooltipCallback: this.buildTooltip(ids),
    };

    return this.chart.type === "line"
      ? buildLineChartOptions(params)
      : buildBarChartOptions(params);
  }
}
