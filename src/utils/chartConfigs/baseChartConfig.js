import { useChartStore } from "@stores";
import { customTooltip } from "./customTooltip";

export const baseChartConfig = ({
  config,
  chartRef,
  chartId,
  series,
  tooltipCallBack,
}) => {
  const style = { fontSize: "0.75rem" };

  const isPrefix = config.xLabelPrefixIndexing && config.labelsKey !== "";
  const isSuffix = config.xLabelSuffixIndexing && config.labelsKey !== "";

  const formatterX = (v) => {
    return `${isPrefix ? v : ""}${config.xLabelPrefix}${
      v === 0 ? "" : series[v - 1]?.[config.labelsKey] || v
    }${config.xLabelSuffix}${isSuffix ? v : ""}`;
  };

  const formatterY = (v) => `${config.yLabelPrefix}${v}${config.yLabelSuffix}`;

  const axisX = {
    categories: [],
    tooltip: { enabled: config.xTooltip },
    tickAmount: series.length - 1,
    labels: {
      show: config.xLabels,
      formatter: formatterX,
      style: { fontSize: style.fontSize, colors: config.xLabelsColor },
    },
    title: {
      text: config.xTitleText,
      style: { fontSize: style.fontSize, color: config.xTitleColor },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };

  const axisY = {
    labels: {
      show: config.yLabels,
      offsetY: 4,
      offsetX: -6,
      formatter: formatterY,
      style: { fontSize: style.fontSize, colors: config.yLabelsColor },
    },
    title: {
      text: config.yTitleText,
      offsetX: 6,
      style: { fontSize: style.fontSize, color: config.yTitleColor },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  };

  return {
    chart: {
      fontFamily: "inherit",
      toolbar: { show: true, tools: { download: true, selection: false } },
      zoom: { enabled: false },
      selection: { enabled: true },
      events: {
        selection: (chartCtx, { xaxis }) => {
          if (!xaxis) return;
          const min = Math.max(0, Math.floor(xaxis.min || 0));
          const max = Math.floor(xaxis.max - 1 || 0);

          const state = useChartStore.getState();
          const updateSeries = state.updateSeries;
          const filteredSeries = [...state.charts[chartId].filteredSeries];
          const sliced = filteredSeries.slice(
            min,
            Math.min(max + 1, filteredSeries.length)
          );
          const updatedSeries = sliced.length < 2 ? filteredSeries : sliced;
          updateSeries(chartId, updatedSeries);
        },
        mounted: (chartCtx) => (chartRef.current = chartCtx.el),
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: { lines: { show: config.xGrid } },
      yaxis: { lines: { show: config.yGrid } },
      padding: {
        top: 0,
        left: 0,
        bottom: config.xTitleText ? -5 : 15,
        right: 40,
      },
    },
    tooltip: {
      enabled: config.tooltip,
      intersect: false,
      followCursor: true,
      custom: customTooltip(tooltipCallBack),
    },

    dataLabels: {
      enabled: config.dataLabels,
      style: { fontSize: style.fontSize },
    },
    xaxis: axisX,
    yaxis: axisY,
    legend: { show: false },
    colors: config.colors || ["var(--color-default)"],
  };
};
