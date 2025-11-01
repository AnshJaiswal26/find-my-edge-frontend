// --layouts

const xLabelsKeys = "Date";

// -- bar chart 1
export const defaultLayoutBar1 = {
  title: "P&L Booked on Risk/Reward",
  xLabelsKey: xLabelsKeys,
  wrapperWidth: "100%",
  chartWidth: 100,

  selection: false,
  selectedLegendIndex: null,

  // grid
  xGrid: false,
  yGrid: true,

  // bar
  horizontal: false,
  stacked: false,
  stacked100: false,
  barRadius: 1,

  // xaxis
  xTooltip: true,
  xLabels: false,
  xLabelsColor: "var(--apexcharts-axis-labels-color)",
  xTitleText: "Trades",
  xTitleColor: "var(--apexcharts-axis-labels-color)",
  xLabelPrefix: "",
  xLabelSuffix: "",
  xLabelPrefixIndexing: false,
  xLabelSuffixIndexing: false,

  //yaxis
  yLabels: true,
  yLabelsColor: "var(--apexcharts-axis-labels-color)",
  yTitleText: "Risk/Reward",
  yTitleColor: "var(--apexcharts-axis-labels-color)",
  yLabelPrefix: "1:",
  yLabelSuffix: "",

  tooltip: true,
  dataLabels: false,
};

// -- bar chart 2
export const defaultLayoutBar2 = {
  ...defaultLayoutBar1,
  title: "Win and Lose Rate Over Time",
  xLabelsKey: "day",

  // xaxis
  xTitleText: "Days",

  //yaxis
  yTitleText: "Rate",
  yLabelPrefix: "",
  yLabelSuffix: "%",
};

// -- line chart 1
export const defaultLayoutLine1 = {
  title: "P&L Over Time",
  xLabelsKey: xLabelsKeys, // same as bar chart

  chartWidth: 100,

  selection: true,
  selectedLegendIndex: null,

  // grid
  xGrid: false,
  yGrid: true,

  // line
  curve: "smooth", // straight, smooth, stepline
  strokeWidth: 2,

  // markers
  markerSize: 0,
  markerHoverSize: 5,

  // area settings
  area: true, // enable/disable area fill
  areaGradientHorizontal: false, // or 'vertical'
  areaOpacityFrom: 0.3,
  areaOpacityTo: 0.05,

  // xaxis
  xTooltip: true,
  xLabels: false,
  xLabelsColor: "var(--apexcharts-axis-labels-color)",
  xTitleText: "Date",
  xTitleColor: "var(--apexcharts-axis-labels-color)",
  xLabelPrefix: "",
  xLabelSuffix: "",
  xLabelPrefixIndexing: false,
  xLabelSuffixIndexing: false,

  // yaxis
  yLabels: true,
  yLabelsColor: "var(--apexcharts-axis-labels-color)",
  yTitleText: "Pnl",
  yTitleColor: "var(--apexcharts-axis-labels-color)",
  yLabelPrefix: "₹",
  yLabelSuffix: "",

  tooltip: true,
  dataLabels: false,
};

export const defaultLayoutLine2 = {
  ...defaultLayoutLine1,
  title: "Capital Growth",
};

export const defaultLayoutLine3 = {
  ...defaultLayoutLine1,
  title: "Pnl Growth",
};

export const defaultLayoutRadial1 = {
  title: "Radial Progress",
  chartWidth: 100,

  selectedLegendIndex: null,

  tooltip: true,
  dataLabels: true,
  legend: false,

  // Radial specifics
  hollowSize: "50%",
  trackBackground: "var(--color-gray-100)",
  strokeWidth: "50%",
  startAngle: 0,
  endAngle: 360,

  // Data label parts
  name: true,
  value: true,
  total: true,

  // Legend behavior
  legendToggle: false,
};

// --series configs
// -- bar chart 1
export const seriesConfigBar1 = [
  {
    key: "Risk/Reward",
    name: "Risk/Reward",
    colors: [
      {
        from: 0.61,
        to: Number.MAX_SAFE_INTEGER,
        color: "var(--color-green)",
        label: "Reward Taken",
      },
      {
        from: 0,
        to: 0.6,
        color: "var(--color-yellow)",
        label: "Breakeven",
      },
      {
        from: Number.MIN_SAFE_INTEGER,
        to: -0.01,
        color: "var(--color-red)",
        label: "Risk Taken",
      },
    ],
  },
];
// -- bar chart 2
export const seriesConfigBar2 = [
  {
    key: "Win Rate",
    name: "Win Rate",
    colors: [
      {
        from: 0,
        to: Number.MAX_SAFE_INTEGER,
        color: "var(--color-green)",
        label: "Win Rate",
      },
    ],
  },
  {
    key: "Lose Rate",
    name: "Lose Rate",
    colors: [
      {
        from: 0,
        to: Number.MAX_SAFE_INTEGER,
        color: "var(--color-red)",
        label: "Lose Rate",
      },
    ],
  },
];
// -- line chart 1
export const seriesConfigLine1 = [
  {
    key: "Pnl",
    name: "Pnl",
    color: "var(--color-cyan)",
    markerColor: "var(--color-cyan)",
    areaColor: "var(--color-cyan)",
  },
  {
    key: "Cummulative Pnl",
    name: "Cummulative Pnl",
    color: "var(--color-yellow)",
    markerColor: "var(--color-yellow)",
    areaColor: "var(--color-yellow)",
  },
];

export const seriesConfigLine2 = [
  {
    key: "Capital",
    name: "Captial",
    color: "var(--color-yellow)",
    markerColor: "var(--color-yellow)",
    areaColor: "var(--color-yellow)",
  },
];

export const seriesConfigLine3 = [
  {
    key: "Profit",
    name: "Profit",
    color: "var(--color-green)",
    markerColor: "var(--color-green)",
    areaColor: "var(--color-green)",
  },
  {
    key: "Loss",
    name: "Loss",
    color: "var(--color-red)",
    markerColor: "var(--color-red)",
    areaColor: "var(--color-red)",
  },
];

export const seriesConfigRadial1 = [
  {
    key: "Completion",
    name: "Completion",
    color: "var(--color-green)",
    label: "Completion %", // used in tooltip
  },

  {
    key: "Percentage",
    name: "Percentage",
    color: "var(--color-red)",
    label: "Completion %", // used in tooltip
  },
  {
    key: "Ratio",
    name: "Ratio",
    color: "var(--color-yellow)",
    label: "Completion %", // used in tooltip
  },
];

// mock data
// -- bar chart 2
export const seriesBar2 = [
  { day: "Day 1", "Win Rate": 55, "Lose Rate": 45 },
  { day: "Day 2", "Win Rate": 60, "Lose Rate": 40 },
  { day: "Day 3", "Win Rate": 70, "Lose Rate": 30 },
  { day: "Day 4", "Win Rate": 50, "Lose Rate": 50 },
  { day: "Day 5", "Win Rate": 65, "Lose Rate": 35 },
  { day: "Day 6", "Win Rate": 58, "Lose Rate": 42 },
  { day: "Day 7", "Win Rate": 62, "Lose Rate": 38 },
];

// -- radialbar chart 1
export const radialData = [
  { Date: "2025-10-01", Completion: 65 },
  { Date: "2025-10-02", Percentage: 75 },
  { Date: "2025-10-03", Ratio: 75 },
];

// -- radar chart 1
export const radarData = [
  // each point is an object with axes keys
  { axis: "Q1", Pnl: 10, Profit: 8 },
  { axis: "Q2", Pnl: 15, Profit: 20 },
  { axis: "Q3", Pnl: 6, Profit: 4 },
  { axis: "Q4", Pnl: 12, Profit: 11 },
];
