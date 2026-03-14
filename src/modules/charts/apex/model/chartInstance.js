import ApexCharts from "apexcharts";
import {
  applyFilters,
  applySort,
  evaluateColorRules,
  smallHash,
} from "@shared/utils";

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

    this.originalIds = dataset.ids;

    this.processedIds = null;

    this.filterHash = 0;
    this.sortHash = 0;

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
    const ids = this.getVisibleIds();

    const series = this.computeSeries(ids);

    const options = this.buildOptions(ids, series);

    this.apex = new ApexCharts(this.container, {
      ...options,
      series,
    });

    this.apex.render();
  }

  update() {
    const ids = this.getVisibleIds();

    const series = this.computeSeries(ids);

    const options = this.buildOptions(ids, series);

    this.apex.updateOptions(options, false, true);
    this.apex.updateSeries(series, true);
  }

  destroy() {
    this.apex?.destroy();
  }

  toggleSeries(seriesName) {
    this.apex.toggleSeries(seriesName);
  }

  hideSeries(seriesName) {
    this.apex.hideSeries(seriesName);
  }

  highlightSeries(seriesName) {
    this.apex.highlightSeries(seriesName);
  }

  /* =========================
     DATA PIPELINE
  ========================= */

  recomputeSeries() {
    this.update();
  }

  getVisibleIds() {
    return this.computeIds();
  }

  computeIds() {
    const processed = this.computeProcessedIds();

    const { selection } = this.chart;

    if (selection?.from != null && selection?.to != null) {
      return processed.slice(selection.from, selection.to);
    }

    return processed;
  }

  computeProcessedIds() {
    const { filters, sort } = this.chart;

    const newFilterHash = smallHash(filters);
    const newSortHash = smallHash(sort);

    if (
      this.processedIds &&
      newFilterHash === this.filterHash &&
      newSortHash === this.sortHash
    ) {
      return this.processedIds;
    }

    let result = this.originalIds;

    const getValue = (id, key) => this.seriesSelector(id, key);

    /* FILTER */
    if (filters?.length) {
      result = result.filter((id) => applyFilters(filters, id, getValue));
    }

    /* SORT */
    if (sort?.key && sort.operator !== "none") {
      result = applySort(result, sort, this.seriesSelector);
    }

    this.processedIds = result;

    this.filterHash = newFilterHash;
    this.sortHash = newSortHash;

    return result;
  }

  computeSeries(ids) {
    const { seriesOrder, seriesById, type } = this.chart;

    if (type === ChartType.DONUT || type === ChartType.RADIAL_BAR) {
      return seriesOrder.map((id) => Math.abs(seriesById[id].value));
    }

    return seriesOrder.map((sId) => ({
      name: seriesById[sId].label,

      data: ids.map((id) => this.seriesSelector(id, seriesById[sId].field)),

      color:
        type === "line"
          ? seriesById[sId].color
          : ({ value }) =>
              evaluateColorRules(value, seriesById[sId].colorRules)?.color,
    }));
  }

  /* =========================
     TOOLTIP
  ========================= */

  buildTooltip() {
    const { type, id } = this.chart;
    if (type === ChartType.DONUT || type === ChartType.RADIAL_BAR)
      return (seriesValue, index, seriesIndex, w) =>
        groupedTooltipCallback({
          chartId: id,
          seriesIndex,
          seriesValue,
          index,
          w,
        });

    return (seriesValue, index, seriesIndex, w) =>
      seriesTooltipCallback({
        chartId: id,
        seriesValue,
        index,
        seriesIndex,
        w,
      });
  }

  /* =========================
     OPTIONS BUILDER
  ========================= */

  buildOptions(ids, computedSeries) {
    const { type, id, layout, mode, seriesOrder, seriesById, xMetric } =
      this.chart;

    const params = {
      ids,
      type,
      chartId: id,
      layout,
      seriesSelector: this.seriesSelector,
      series: seriesOrder.map((id) => seriesById[id]),
      mode,
      xMetric,
      groupSelector: this.groupSelector,
      tooltipCallback: this.buildTooltip(),
      dataSeries: computedSeries,
    };

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
