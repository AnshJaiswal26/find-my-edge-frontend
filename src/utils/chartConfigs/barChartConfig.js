import { useChartStore } from "@stores";
import { customTooltip } from "./customTooltip";
import ReactApexChart from "react-apexcharts";

export const getBarChartConfig = ({
  config,
  chartRef,
  chartId,
  series,
  tooltipCallBack,
}) => {
  const style = {
    fontSize: "0.75rem",
  };

  const isXLabelPrefixIdxVisible =
    config.xLabelPrefixIndexing && config.labelsKey !== "";

  const isXLabelSuffixIdxVisible =
    config.xLabelSuffixIndexing && config.labelsKey !== "";

  const formatter1 = (v) =>
    `${isXLabelPrefixIdxVisible ? v : ""}${config.xLabelPrefix}${
      v === 0 ? "" : series[v - 1]?.[config.labelsKey] || v
    }${config.xLabelSuffix}${isXLabelSuffixIdxVisible ? v : ""}`;
  const formatter2 = (v) => `${config.yLabelPrefix}${v}${config.yLabelSuffix}`;

  const axisCfg1 = {
    categories: [],
    tooltip: { enabled: config.xTooltip },
    tickAmount: series.length,
    labels: {
      show: config.xLabels,
      formatter: formatter1,
      style: { fontSize: style.fontSize, colors: config.xLabelsColor },
    },
    title: {
      text: config.xTitleText,
      style: { fontSize: "0.75rem", color: config.xTitleColor },
    },
    min: 1,
    max: Math.max(1, series.length),
    axisBorder: { show: false },
    axisTicks: { show: false },
  };
  const axisCfg2 = {
    tooltip: { enabled: config.yTooltip },
    labels: {
      show: config.yLabels,
      offsetY: 4,
      offsetX: -6,
      formatter: formatter2,
      style: { fontSize: style.fontSize, colors: config.yLabelsColor },
    },
    title: {
      text: config.yTitleText,
      offsetX: 6,
      style: {
        fontSize: "0.75rem",
        color: config.yTitleColor,
      },
    },
  };

  const options = {
    chart: {
      type: "bar",
      stacked: config.stacked,
      stackType: config.stacked100 ? "100%" : "normal",
      toolbar: {
        show: true,
        tools: { download: true, selection: series.length > 1 },
      },
      zoom: { enabled: false },
      selection: { enabled: true },
      fontFamily: "inherit",
      events: {
        selection: (chartCtx, { xaxis }) => {
          const min = Math.max(0, Math.floor(xaxis.min || 0));
          const max = Math.floor(xaxis.max || 0);

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
        bottom: config.xTitleText !== "" ? -5 : 15,
        right: 30,
      },
    },
    plotOptions: {
      bar: {
        horizontal: config.horizontal,
        columnWidth: "75%",
        borderRadius: config.barRadius,
        distributed: false,
      },
    },
    xaxis: config.horizontal ? axisCfg2 : axisCfg1,
    yaxis: config.horizontal ? axisCfg1 : axisCfg2,
    tooltip: {
      enabled: config.tooltip,
      intersect: false,
      shared: true,
      custom: customTooltip(tooltipCallBack),
    },
    legend: { show: false },
    colors: ["#1979ff"],
    dataLabels: { enabled: config.dataLabels, style: { fontSize: "0.75rem" } },
  };

  return options;
};

// const apexOptions = useMemo(
//   () => ({
//     chart: {
//       type: "line",
//       height: 300,
//       toolbar: { show: false },
//       fontFamily: "inherit",
//       selection: { enabled: false },
//       zoom: { enabled: false },
//     },
//     grid: {
//       strokeDashArray: 3,
//       yaxis: { lines: { show: true } },
//       xaxis: { lines: { show: false } },
//     },
//     xaxis: {
//       categories,
//       labels: {
//         show: !fullSize,
//         style: {
//           fontSize: "12px",
//           colors: "var(--apexcharts-axis-labels-color)",
//         },
//       },
//       max: fullSize ? categories.length + 3 : categories.length,
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//     },
//     yaxis: {
//       labels: {
//         style: {
//           fontSize: "12px",
//           colors: "var(--apexcharts-axis-labels-color)",
//         },
//       },
//     },
//     tooltip: {
//       custom: customTooltip(customTooltipCallback),
//       style: {
//         fontSize: "14px",
//         color: "#34495e",
//       },
//       x: {
//         show: true,
//         style: {
//           fontSize: "12px",
//           fontWeight: "700",
//           color: "#ddd",
//         },
//       },
//     },
//     stroke: {
//       curve: "smooth",
//       width: 2,
//       colors: [val2 > val1 ? "#05ab72" : "#fe5a5a"],
//     },
//     colors: [val2 > val1 ? "#05ab72" : "#fe5a5a"],
//     markers: {
//       size: 0,
//       strokeWidth: 0,
//       hover: { size: 4 },
//     },
//     legend: { show: false },
//     dataLabels: {
//       enabled: false,
//     },
//   }),
//   [theme, categories, val1, val2]
// );
