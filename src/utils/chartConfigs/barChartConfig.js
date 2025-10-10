import { customTooltip } from "./customTooltip";

export const getBarChartConfig = ({ config, events, tooltipCallBack }) => {
  const style = {
    fontSize: "0.75rem",
  };

  const options = {
    chart: {
      type: "bar",
      stacked: config.stacked,
      stackType: config.stacked100 ? "100%" : "normal",
      toolbar: { show: true, tools: { download: true } },
      zoom: { enabled: false },
      selection: { enabled: config.filteredSeries.length > 1 },
      fontFamily: "inherit",
      events,
    },
    grid: {
      show: config.gridEnabled,
      xaxis: { lines: { show: config.xaxisGrid } },
      yaxis: { lines: { show: config.yaxisGrid } },
      padding: { top: 0, left: 0, bottom: 0, right: 30 },
    },
    plotOptions: {
      bar: {
        horizontal: config.barHorizontal,
        columnWidth: "75%",
        borderRadius: config.borderRadius,
        distributed: false,
        colors: { ranges: config?.colorRange ?? [] },
      },
    },
    xaxis: {
      categories: [],
      tooltip: { enabled: config.xaxisTooltip },
      labels: {
        show: config.xaxisLabels,
        formatter: (v, { dataPointIndex }) => {
          return `${config.xaxisLabelSeries[dataPointIndex]}`;
        },
        style: { fontSize: style.fontSize, colors: style.xaxisLabelsColor },
      },
      title: {
        text: config.xaxisTitleText,
        style: { fontSize: "0.75rem", color: config.xaxisTitleColor },
      },
      min: 0,
      max: Math.max(1, config.filteredSeries.length),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      tooltip: { enabled: config.yaxisTooltip },
      labels: {
        offsetY: 4,
        offsetX: -6,
        formatter: (v) => `${config.yaxisLabelPrefix}${v}`,
        style: { fontSize: style.fontSize, colors: config.yaxisLabelsColor },
      },
      title: {
        text: config.yaxisTitleText,
        style: {
          fontSize: "0.75rem",
          color: config.yaxisTitleColor,
        },
      },
    },
    tooltip: {
      enabled: config.tooltip,
      intersect: false,
      custom: customTooltip(tooltipCallBack),
    },

    colors: ["#ffff"],
    dataLabels: { enabled: config.dataLabels, style: { fontSize: "0.75rem" } },
    legend: { show: config.legend },
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
