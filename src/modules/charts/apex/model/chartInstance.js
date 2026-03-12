import ApexCharts from "apexcharts";
import { applyFilters, applySort, evaluateColorRules } from "@shared/utils";

import { seriesTooltipCallback } from "../tooltip/series.tooltip";
import {
  buildLineChartOptions,
  buildBarChartOptions,
  buildPieChartOptions,
  buildRadialBarChartOptions,
} from "../options";
import { ChartType } from "./enums";
import { groupedTooltipCallback } from "../tooltip/group.tooltip";

export default class ChartInstance {
  constructor(container, chartId, store, dataset) {
    this.container = container;
    this.chartId = chartId;
    this.store = store;
    this.dataset = dataset;

    this.seriesSelector = dataset.seriesSelector;
    this.groupSelector = dataset.groupSelector;

    this.render();
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
    this.apex?.destroy();
  }

  toggleSeries(seriesName) {
    this.apex.toggleSeries(seriesName);
  }

  /* =========================
     DATA PIPELINE
  ========================= */

  recomputeSeries() {
    const ids = this.dataset.ids;

    const finalIds = this.computeIds(ids);

    const series = this.computeSeries(finalIds);

    this.apex.updateSeries(series, true);
  }

  computeIds(ids) {
    const { filters, sort, selection } = this.chart;

    let result = ids;

    /* FILTER */
    const getValue = (id, key) => this.seriesSelector(id, key);

    if (filters?.length) {
      result = result.filter((id) => applyFilters(filters, id, getValue));
    }

    /* SORT */
    if (sort?.key && sort.operator !== "none") {
      result = applySort(result, sort, this.seriesSelector);
    }

    /* SELECTION */
    if (selection && selection?.from !== null && selection?.to !== null) {
      result = result.slice(selection.from, selection.to);
    }

    return result;
  }

  computeSeries(ids) {
    const { series, type } = this.chart;

    if (type === ChartType.DONUT || type === ChartType.RADIAL_BAR) {
      if (ChartType.RADIAL_BAR) return [20, 50];
      return series.map((c) => Math.abs(c.value));
    }

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

  buildTooltip() {
    const { type } = this.chart;
    if (type === ChartType.DONUT || type === ChartType.RADIAL_BAR)
      return (seriesValue, index, seriesIndex, w) =>
        groupedTooltipCallback({
          chartId: this.chartId,
          seriesIndex,
          seriesValue,
          index,
          w,
        });

    return (seriesValue, index, seriesIndex, w) =>
      seriesTooltipCallback({
        chartId: this.chartId,
        seriesValue,
        index,
        seriesIndex,
        w,
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
      tooltipCallback: this.buildTooltip(),
      dataSeries: this.computeSeries(ids),
    };

    const type = this.chart.type;

    if (type === ChartType.LINE) {
      return buildLineChartOptions(params);
    }

    if (type === ChartType.BAR) {
      return buildBarChartOptions(params);
    }

    if (type === ChartType.DONUT) {
      return buildPieChartOptions(params);
    }

    if (type === ChartType.RADIAL_BAR) {
      return buildRadialBarChartOptions(params);
    }
  }
}
