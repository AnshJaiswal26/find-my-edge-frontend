import { tradeData } from "./tradeData";

// --- default layouts ---
const defaultBarChartLayout = {
  title: "",

  chartWidth: 100,

  selection: false,

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
  yTitleText: "",
  yTitleColor: "var(--apexcharts-axis-labels-color)",
  yLabelPrefix: "",
  yLabelSuffix: "",

  tooltip: true,
  dataLabels: false,

  legend: true,
  legendPosition: "top",
  legendAlignment: "center",
};

const defaultLineChartLayout = {
  ...defaultBarChartLayout,
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
};

const defaultRadialBarChartLayout = {
  title: "",
  chartWidth: 100,

  selectedLegendIndex: null,

  tooltip: true,

  // Radial specifics
  hollowSize: "50%",
  gradientType: "gradient",
  trackBackground: "var(--color-bg-hover)",
  strokeWidth: "50%",
  startAngle: 0,
  endAngle: 360,
  strokeLineCap: "round",

  // Data label parts
  name: true,
  namePrefix: "",
  nameSuffix: "",

  value: true,
  valuePrefix: "",
  valueSuffix: "%",

  total: true,
  totalLabel: "Avg",
  totalPrefix: "",
  totalSuffix: "%",

  legend: true,
  legendPosition: "bottom",
  legendAlignment: "center",
};

export const defaultCharts = {
  bar: {
    "apex-bar-chart-1": {
      data: tradeData,
      meta: {
        id: "apex-bar-chart-1",
        type: "bar",
        xaxisMetric: "Date",
      },
      layout: {
        ...defaultBarChartLayout,
        xTitleText: "Trades",
        yTitleText: "Risk/Reward",
        yLabelPrefix: "1:",
        title: "P&L Booked on Risk/Reward",
      },
      seriesConfig: [
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
      ],
    },
    "apex-bar-chart-2": {
      data: [
        { day: "Day 1", "Win Rate": 55, "Lose Rate": 45 },
        { day: "Day 2", "Win Rate": 60, "Lose Rate": 40 },
        { day: "Day 3", "Win Rate": 70, "Lose Rate": 30 },
        { day: "Day 4", "Win Rate": 50, "Lose Rate": 50 },
        { day: "Day 5", "Win Rate": 65, "Lose Rate": 35 },
        { day: "Day 6", "Win Rate": 58, "Lose Rate": 42 },
        { day: "Day 7", "Win Rate": 62, "Lose Rate": 38 },
      ],
      meta: {
        id: "apex-bar-chart-2",
        type: "bar",
        xaxisMetric: "day",
      },
      layout: {
        ...defaultBarChartLayout,
        xTitleText: "Days",
        yTitleText: "Rate",
        yLabelPrefix: "",
        yLabelSuffix: "%",
        title: "Win and Lose Rate Over Time",
      },
      seriesConfig: [
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
      ],
    },
  },
  line: {
    "apex-line-chart-1": {
      data: tradeData,
      meta: {
        id: "apex-line-chart-1",
        type: "line",
        xaxisMetric: "Date",
      },
      layout: {
        ...defaultLineChartLayout,
        xTitleText: "Date",
        yTitleText: "Pnl",
        yLabelPrefix: "₹",
        title: "P&L Over Time",
      },
      seriesConfig: [
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
      ],
    },
    "apex-line-chart-2": {
      data: tradeData,
      meta: {
        id: "apex-line-chart-2",
        type: "line",
        xaxisMetric: "Date",
      },
      layout: {
        ...defaultLineChartLayout,
        title: "Capital Growth",
      },
      seriesConfig: [
        {
          key: "Capital",
          name: "Captial",
          color: "var(--color-yellow)",
          markerColor: "var(--color-yellow)",
          areaColor: "var(--color-yellow)",
        },
      ],
    },
    "apex-line-chart-3": {
      data: tradeData,
      meta: {
        id: "apex-line-chart-3",
        type: "line",
        xaxisMetric: "Date",
      },
      layout: {
        ...defaultLineChartLayout,
        title: "Pnl Growth",
      },
      seriesConfig: [
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
      ],
    },
  },
  radialBar: {
    "apex-radial-bar-chart-1": {
      data: [
        Number(
          parseFloat(
            (tradeData.filter((d) => d.Profit !== 0).length /
              tradeData.length) *
              100
          ).toFixed(2)
        ),
        Number(
          parseFloat(
            (tradeData.filter((d) => d.Loss !== 0).length / tradeData.length) *
              100
          ).toFixed(2)
        ),
      ],
      meta: {
        id: "apex-radial-bar-chart-1",
        type: "raidialBar",
      },
      layout: { ...defaultRadialBarChartLayout, title: "Radial Progress" },
      seriesConfig: [
        { key: "Wins", name: "Wins", color: "var(--color-green)" },
        { key: "Loses", name: "Loses", color: "var(--color-red)" },
      ],
    },
  },
  pie: {},
  radar: {},
};

// -- radar chart 1
const radarData = [
  // each point is an object with axes keys
  { axis: "Q1", Pnl: 10, Profit: 8 },
  { axis: "Q2", Pnl: 15, Profit: 20 },
  { axis: "Q3", Pnl: 6, Profit: 4 },
  { axis: "Q4", Pnl: 12, Profit: 11 },
];
