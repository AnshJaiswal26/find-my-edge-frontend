import ApexCharts from "apexcharts";
import {
  applyFilters,
  applySort,
  evaluateColorRules,
  smallHash,
} from "@shared/utils";

import { seriesTooltipCallback } from "../tooltip/series.tooltip";
import {
  buildBarChartOptions,
  buildLineChartOptions,
  buildPieChartOptions,
  buildRadialBarChartOptions,
} from "../options";
import { CHART_TYPE } from "./enums";
import { groupedTooltipCallback } from "../tooltip/group.tooltip";

export default class ChartInstance {
  constructor(container, chartId, store) {
    this.container = container;
    this.chartId = chartId;
    this.store = store;

    /* dataset */
    this.dataset = null;
    this.originalIds = [];

    /* selectors */
    this.seriesSelector = null;
    this.groupSelector = null;

    /* pipeline */
    this.processedIds = null;

    this.currentGroupIndex = 0;

    this.filterHash = 0;
    this.sortHash = 0;

    /* chart instance */
    this.apex = null;
  }

  get chart() {
    return this.store.getState().charts[this.chartId];
  }

  /* =========================
     DATASET
  ========================= */

  setDataset(dataset) {
    this.dataset = dataset;

    this.originalIds = dataset.ids ?? [];
    this.seriesSelector = dataset.seriesSelector;

    this.groupSelector = dataset.groupSelector;

    /* reset pipeline */
    this.processedIds = null;

    this.currentGroupIndex = 0;

    this.filterHash = 0;
    this.sortHash = 0;

    if (!this.apex) {
      this.render();
    } else {
      this.update();
    }
  }

  /* =========================
     LIFECYCLE
  ========================= */

  render() {
    if (!this.dataset) return;

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
    if (!this.apex || !this.dataset) return;

    const ids = this.getVisibleIds();
    const series = this.computeSeries(ids);
    const options = this.buildOptions(ids, series);

    this.apex.updateOptions(options, false, true);
    this.apex.updateSeries(series, true);
  }

  destroy() {
    this.apex?.destroy();
    this.apex = null;
  }

  /* =========================
     GROUPS
  ========================= */

  showGroup(index) {
    if (!this.groupSelector || this.currentGroupIndex === index) return;

    this.currentGroupIndex = index;
    this.update();
  }

  getGroups() {
    let index = 0;
    const groups = [];

    while (true) {
      const group = this.groupSelector?.(index);
      if (!group) break;
      groups.push(group);
      index++;
    }

    return {
      groups: groups ?? [],
      currentGroupIndex: this.currentGroupIndex,
    };
  }

  /* =========================
     DATA PIPELINE
  ========================= */

  recomputeSeries() {
    this.processedIds = null;
    this.update();
  }

  getVisibleIds() {
    return this.computeIds();
  }

  computeIds() {
    let ids;

    if (this.groupSelector) {
      const group = this.groupSelector(this.currentGroupIndex);
      ids = group?.ids;
    }

    if (!ids) {
      ids = this.computeProcessedIds();
    }

    const { selection } = this.chart;

    if (selection?.from != null && selection?.to != null) {
      return ids.slice(selection.from, selection.to);
    }

    return ids;
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

    /* FILTER */
    if (filters?.length) {
      result = result.filter((id) =>
        applyFilters(filters, id, this.seriesSelector),
      );
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

    if (type === CHART_TYPE.DONUT || type === CHART_TYPE.RADIAL_BAR) {
      return seriesOrder.map((id) => Math.abs(seriesById[id].value));
    }

    return seriesOrder.map((sId) => ({
      name: seriesById[sId].label,

      data: ids.map((id) => this.seriesSelector(id, seriesById[sId])),

      color:
        type === CHART_TYPE.LINE
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

    if (type === CHART_TYPE.DONUT || type === CHART_TYPE.RADIAL_BAR) {
      return (seriesValue, index, seriesIndex, w) =>
        groupedTooltipCallback({
          chartId: id,
          seriesIndex,
          seriesValue,
          index,
          w,
        });
    }

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

    if (type === CHART_TYPE.LINE) return buildLineChartOptions(params);
    if (type === CHART_TYPE.BAR) return buildBarChartOptions(params);
    if (type === CHART_TYPE.DONUT) return buildPieChartOptions(params);
    if (type === CHART_TYPE.RADIAL_BAR)
      return buildRadialBarChartOptions(params);
  }

  /* =========================
     CHART CONTROL
  ========================= */

  toggleSeries(seriesName) {
    this.apex?.toggleSeries(seriesName);
  }

  hideSeries(seriesName) {
    this.apex?.hideSeries(seriesName);
  }

  highlightSeries(seriesName) {
    this.apex?.highlightSeries(seriesName);
  }
}
