import { customTooltip } from "./customTooltip";

export const getBarChartConfig = ({
  type = "chart",
  horizontal = true,
  conditionalColorRange = [],
  customTooltipCallback = () => ({ title: "", dataArray: [] }),
  barColors = [],
  dataLabels = {},
  xaxis,
  yaxis,
}) => {
  const isChart = type === "chart";

  const style = {
    fontSize: "1rem",
    colors: "var(--apexcharts-axis-labels-color)",
  };

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
      selection: { enabled: false },
      zoom: { enabled: true },
      sparkline: { enabled: !isChart },
    },
    grid: {
      show: isChart,
      strokeDashArray: 1,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    plotOptions: {
      bar: {
        horizontal, // user defined
        vertical: !horizontal,
        columnWidth: "75%",
        borderRadius: 2,
        distributed: false,
        colors: { ranges: conditionalColorRange }, // user defined
      },
    },
    xaxis: {
      tooltip: { enabled: true },
      ...xaxis,
      labels: {
        ...xaxis?.labels,
        style: { ...style, ...xaxis?.labels?.style }, // user defined
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      ...yaxis,
      labels: {
        ...yaxis?.labels,
        style: { ...style, ...yaxis?.labels?.style }, // user defined
      },
    },
    tooltip: {
      enabled: true,
      ...(isChart && { shared: false, intersect: false }),
      custom: customTooltip(customTooltipCallback),
    },
    colors: barColors, // user defined
    dataLabels,
    legend: { show: false },
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
