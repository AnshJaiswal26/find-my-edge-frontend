import { tradeData } from "./tradeData";

// --- default layouts ---
const defaultCartesianLayout = {
  title: "",

  chartWidth: 100,

  // general
  tooltip: true,
  dataLabels: false,
  selection: false,

  // grid
  xGrid: false,
  yGrid: true,

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

  legend: true,
  legendPosition: "top",
  legendAlignment: "center",
};

const defaultBarChartLayout = {
  ...defaultCartesianLayout,
  // bar
  horizontal: false,
  stacked: false,
  stacked100: false,
  barRadius: 1,
};

const defaultLineChartLayout = {
  ...defaultCartesianLayout,
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

const defaultGroupedChartLayout = {
  title: "",
  chartWidth: 100,

  selectedLegendIndex: null,

  tooltip: true,

  // Data label parts
  name: true,

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

const defaultRadialBarChartLayout = {
  ...defaultGroupedChartLayout,

  // Radial specifics
  hollowSize: 50,
  gradientType: "gradient",
  trackBackground: "var(--color-bg-hover)",
  strokeWidth: 50,
  endAngle: 360,
  strokeLineCap: "round",
};

const defaultPieChartLayout = {
  ...defaultGroupedChartLayout,

  // Pie/Donut specifics
  donutSize: 70,
  gradientType: "gradient",
  strokeWidth: 0,

  dataLabels: false,
};

export const defaultRadarChartLayout = {
  title: "",
  chartWidth: 100,

  selectedLegendIndex: null,
  dataLabels: true,
  tooltip: true,

  // Radar specifics
  radarSize: 100,
  polygonStroke: "var(--color-border-default)",
  polygonFill: "var(--color-bg-hover)",
  polygonStrokeWidth: 1,
  radarOpacity: 1,

  // Markers
  markerSize: 5,
  markerHoverSize: 8,

  // Axis / Category Labels
  showXAxisLabels: true,
  showYAxisLabels: true,

  legend: true,
  legendPosition: "bottom",
  legendAlignment: "center",
};

export const defaultPolarAreaChartLayout = {
  title: "",
  chartWidth: 100,

  selectedLegendIndex: null,
  tooltip: true,
  dataLabels: true,

  // Polar-specific
  polarSize: 100,

  ringBorderWidth: 1,
  ringBorderColor: "var(--color-border-default)",

  strokeWidth: 1,
  fillOpacityFrom: 1,
  fillOpacityTo: 0.8,

  // Axis Labels
  showYAxisLabels: true,

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
        category: "series",
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
              tooltipLabel: "Reward Taken",
            },
            {
              from: 0,
              to: 0.6,
              color: "var(--color-yellow)",
              tooltipLabel: "Breakeven",
            },
            {
              from: Number.MIN_SAFE_INTEGER,
              to: -0.01,
              color: "var(--color-red)",
              tooltipLabel: "Risk Taken",
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
        category: "series",
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
              tooltipLabel: "Win Rate",
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
              tooltipLabel: "Lose Rate",
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
        category: "series",
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
          tooltipLabel: "Pnl",
          color: "var(--color-cyan)",
          markerColor: "var(--color-cyan)",
          areaColor: "var(--color-cyan)",
        },
        {
          key: "Cummulative Pnl",
          name: "Cummulative Pnl",
          tooltipLabel: "Cummulative Pnl",
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
        category: "series",
      },
      layout: {
        ...defaultLineChartLayout,
        title: "Capital Growth",
      },
      seriesConfig: [
        {
          key: "Capital",
          name: "Captial",
          tooltipLabel: "Capital",
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
        category: "series",
      },
      layout: {
        ...defaultLineChartLayout,
        title: "Pnl Growth",
      },
      seriesConfig: [
        {
          key: "Profit",
          name: "Profit",
          tooltipLabel: "Profit",
          color: "var(--color-green)",
          markerColor: "var(--color-green)",
          areaColor: "var(--color-green)",
        },
        {
          key: "Loss",
          name: "Loss",
          tooltipLabel: "Loss",
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
        type: "radialBar",
        category: "group",
      },
      layout: { ...defaultRadialBarChartLayout, title: "Radial Progress" },
      seriesConfig: [
        {
          key: "Wins",
          name: "Wins",
          tooltipLabel: "Wins",
          color: "var(--color-green)",
        },
        {
          key: "Loses",
          name: "Loses",
          tooltipLabel: "Loses",
          color: "var(--color-red)",
        },
      ],
    },
  },
  pie: {
    "apex-pie-chart-1": {
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
        id: "apex-pie-chart-1",
        type: "donut",
        category: "group",
      },
      layout: { ...defaultPieChartLayout, title: "Pie Progress" },
      seriesConfig: [
        {
          key: "Wins",
          name: "Wins",
          tooltipLabel: "Wins",
          color: "var(--color-default)",
        },
        {
          key: "Loses",
          name: "Loses",
          tooltipLabel: "Loses",
          color: "var(--color-yellow)",
        },
      ],
    },
  },
  radar: {
    "apex-radar-chart-1": {
      data: [
        { axis: "Nifty 50", Reward: 3.3, Risk: 1.2, Gain: 0.34 },
        { axis: "Bank Nifty", Reward: 1.3, Risk: 1.2, Gain: 0.23 },
        { axis: "Sensex", Reward: 2.1, Risk: 0.93, Gain: 0.56 },
      ],
      meta: {
        id: "apex-radar-chart-1",
        type: "radar",
        category: "group",
      },
      layout: { ...defaultRadarChartLayout, title: "Radar Progress" },
      seriesConfig: [
        {
          key: "Reward",
          name: "Reward",
          tooltipLabel: "Reward",
          color: "var(--color-green)",
          prefix: "1:",
          suffix: "",
        },
        {
          key: "Risk",
          name: "Risk",
          tooltipLabel: "Risk",
          color: "var(--color-red)",
          prefix: "1:",
          suffix: "",
        },
        {
          key: "Gain",
          name: "Gain",
          tooltipLabel: "Gain",
          color: "var(--color-default)",
          prefix: "",
          suffix: "%",
        },
      ],
    },
  },
  polar: {
    "apex-polarArea-chart-1": {
      data: [
        { axis: "Nifty 50", data: 30 },
        { axis: "Bank Nifty", data: 30 },
        { axis: "Sensex", data: 40 },
      ],

      meta: {
        id: "apex-polarArea-chart-1",
        type: "polarArea",
        category: "group",
      },

      layout: {
        ...defaultPolarAreaChartLayout,
        title: "Market Polar Strength",
      },

      seriesConfig: [
        {
          key: "data",
          name: "Momentum",
          tooltipLabel: "Momentum",
          color: "var(--color-default)",
          prefix: "",
          suffix: "%",
        },
        {
          key: "data",
          name: "Volume",
          tooltipLabel: "Volume",
          color: "var(--color-yellow)",
          prefix: "",
          suffix: "%",
        },
        {
          key: "data",
          name: "Volatility",
          tooltipLabel: "Volatility",
          color: "var(--color-red)",
          prefix: "",
          suffix: "%",
        },
      ],
    },
  },
};
