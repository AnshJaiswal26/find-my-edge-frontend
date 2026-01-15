import { tradeData } from "./tradeData";

// --- default layouts ---

const charts = {
  "apex-bar-chart-1": {
    meta: {
      id: "apex-bar-chart-1",
      type: "bar",
      category: "series",
    },

    filteredSeries: [
      { rr: 2, pnl: 1000, date: "2025-08-05" },
      { rr: -1, pnl: 500, date: "2025-08-08" },
      { rr: 3, pnl: 1500, date: "2025-08-05" },
      { rr: 1, pnl: 500, date: "2025-08-08" },
    ], // filtered series by condition
    sortedSeries: [], // sorted series in order
    selectedSeries: [], // series slice by selection tool
    groupedSeries: [
      {
        groupKey: "2025-08-12",
        series: [
          { rr: -1, pnl: 500, date: "2025-08-08" },
          { rr: 1, pnl: 500, date: "2025-08-08" },
        ],
      },

      // other group
      {
        groupKey: " Not 2025-08-12",
        series: [
          { rr: 2, pnl: 1000, date: "2025-08-05" },
          { rr: 3, pnl: 1500, date: "2025-08-05" },
        ],
      },
    ], // series grouped by x axis

    groupBy: {
      key: "date", // x series id like 'date'
      type: "date", // number | text | date | time
      mode: "value", // value | condition
      operation: "none", //  greaterThan, lessThan.... for condition based grouping
      group1Name: "", // group 1 label
      group2Name: "", // group 1 label
      value: "2025-08-05", // value for conditions or value mode
      valueTo: "", // value for conditions like isBetween | isNotBetween
    },

    sort: {
      key: "rr",
      operator: "none",
    },

    filters: [
      {
        key: "rr",
        operator: "none",
        value: "",
        value2: "",
      },
    ],

    layout: {
      title: "",

      chartWidth: 100,

      // bar
      horizontal: false,
      stacked: false,
      stacked100: false,
      barRadius: 1,

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
      xLabelsColor: "var(--text-charts-muted)",
      xTitleText: "Date",
      xTitleColor: "var(--text-charts-muted)",
      xDisplay: { format: "YYYY-MM-DD", decimals: 0 },

      //yaxis
      yLabels: true,
      yLabelsColor: "var(--text-charts-muted)",
      yTitleText: "Risk-Reward",
      yTitleColor: "var(--text-charts-muted)",
      yDisplay: { format: "RATIO", decimals: 2 },

      legend: true,
      legendPosition: "top",
      legendAlignment: "center",
    },

    xSeriesConfig: { key: "date" },
    ySeriesConfig: [
      {
        key: "rr",
        label: "Risk/Reward",
        type: "number", // number | time | date  (all are numeric just for formating i have taken time (number -> hh:mm:ss A etc..), date (number -> YYYY-MM-DD etc..))
        colors: [
          {
            operator: "greaterThan",
            value: 0.6,
            value2: 0,
            color: "var(--success)",
          },
          {
            operator: "isBetween",
            value: 0,
            value2: 0.6,
            color: "var(--warning)",
          },
          {
            operator: "lessThan",
            value: 0,
            value2: 0,
            color: "var(--error)",
          },
        ],
      },
      {
        key: "pnl",
        label: "Pnl",
        colors: [
          {
            operator: "greaterThan",
            value: 60,
            value2: 0,
            color: "var(--success)",
          },
          {
            operator: "isBetween",
            value: 0,
            value2: 60,
            color: "var(--warning)",
          },
          {
            operator: "lessThan",
            value: 0,
            value2: 0,
            color: "var(--error)",
          },
        ],
      },
    ],
  },
};

const DEFAULT_CARTESIAN_LAYOUT = {
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
  xLabelsColor: "var(--text-charts-muted)",
  xTitleText: "Trades",
  xTitleColor: "var(--text-charts-muted)",
  xLabelPrefix: "",
  xLabelSuffix: "",
  xLabelPrefixIndexing: false,
  xLabelSuffixIndexing: false,

  //yaxis
  yLabels: true,
  yLabelsColor: "var(--text-charts-muted)",
  yTitleText: "",
  yTitleColor: "var(--text-charts-muted)",
  yLabelPrefix: "",
  yLabelSuffix: "",

  legend: true,
  legendPosition: "top",
  legendAlignment: "center",
};

const DEFAULT_BAR_CHART_LAYOUT = {
  ...DEFAULT_CARTESIAN_LAYOUT,
  // bar
  horizontal: false,
  stacked: false,
  stacked100: false,
  barRadius: 1,
};

const DEFAULT_LINE_CHART_LAYOUT = {
  ...DEFAULT_CARTESIAN_LAYOUT,
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

const DEFAULT_GROUPED_CHART_LAYOUT = {
  title: "",
  chartWidth: 100,

  selectedLegendIndex: [],
  unSelectedLegendIndex: [],

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

const DEFAULT_RADIAL_BAR_CHART_LAYOUT = {
  ...DEFAULT_GROUPED_CHART_LAYOUT,

  // Radial specifics
  hollowSize: 50,
  gradientType: "gradient",
  trackBackground: "var(--hover)",
  strokeWidth: 50,
  endAngle: 360,
  strokeLineCap: "round",
};

const DEFAULT_PIE_CHART_LAYOUT = {
  ...DEFAULT_GROUPED_CHART_LAYOUT,

  // Pie/Donut specifics
  donutSize: 70,
  gradientType: "gradient",
  strokeWidth: 0,

  dataLabels: false,
};

const DEFAULT_RADAR_CHART_LAYOUT = {
  title: "",
  chartWidth: 100,

  selectedLegendIndex: null,
  dataLabels: true,
  tooltip: true,

  // Radar specifics
  radarSize: 100,
  polygonStroke: "var(--border)",
  polygonFill: "var(--hover)",
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

const DEFAULT_POLARAREA_CHART_LAYOUT = {
  title: "",
  chartWidth: 100,

  selectedLegendIndex: null,
  tooltip: true,
  dataLabels: true,

  // Polar-specific
  polarSize: 100,

  ringBorderWidth: 1,
  ringBorderColor: "var(--border)",

  strokeWidth: 1,
  fillOpacityFrom: 1,
  fillOpacityTo: 0.8,

  // Axis Labels
  showYAxisLabels: true,

  legend: true,
  legendPosition: "bottom",
  legendAlignment: "center",
};

export const DEFAULT_CHARTS = {
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
        ...DEFAULT_BAR_CHART_LAYOUT,
        xTitleText: "Trades",
        yTitleText: "Risk/Reward",
        yLabelPrefix: "1:",
        title: "P&L Booked on Risk/Reward",
      },

      xSeriesConfig: { key: "Date", name: "Date" },
      seriesConfig: [
        {
          key: "Risk/Reward",
          name: "Risk/Reward",
          colors: [
            {
              from: 0.61,
              to: Number.MAX_SAFE_INTEGER,
              color: "var(--success)",
              tooltipLabel: "Reward Taken",
            },
            {
              from: 0,
              to: 0.6,
              color: "var(--warning)",
              tooltipLabel: "Breakeven",
            },
            {
              from: Number.MIN_SAFE_INTEGER,
              to: -0.01,
              color: "var(--error)",
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
        ...DEFAULT_BAR_CHART_LAYOUT,
        xTitleText: "Days",
        yTitleText: "Rate",
        yLabelPrefix: "",
        yLabelSuffix: "%",
        title: "Win and Lose Rate Over Time",
      },
      xSeriesConfig: { key: "day", name: "day" },

      seriesConfig: [
        {
          key: "Win Rate",
          name: "Win Rate",
          colors: [
            {
              from: 0,
              to: Number.MAX_SAFE_INTEGER,
              color: "var(--success)",
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
              color: "var(--error)",
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
        xaxisMetric: "Entry Time",
        category: "series",
      },
      layout: {
        ...DEFAULT_LINE_CHART_LAYOUT,
        xTitleText: "Date",
        yTitleText: "Pnl",
        yLabelPrefix: "₹",
        title: "P&L Over Time",
      },
      xSeriesConfig: { key: "Entry Time", name: "Entry Time" },

      seriesConfig: [
        {
          key: "Pnl",
          name: "Pnl",
          tooltipLabel: "Pnl",
          color: "var(--cyan)",
          markerColor: "var(--cyan)",
          areaColor: "var(--cyan)",
        },
        {
          key: "Cummulative Pnl",
          name: "Cummulative Pnl",
          tooltipLabel: "Cummulative Pnl",
          color: "var(--warning)",
          markerColor: "var(--warning)",
          areaColor: "var(--warning)",
        },
      ],
    },
    "apex-line-chart-2": {
      data: tradeData,
      meta: {
        id: "apex-line-chart-2",
        type: "line",
        xaxisMetric: "Trade",
        category: "series",
      },
      layout: {
        ...DEFAULT_LINE_CHART_LAYOUT,
        title: "Capital Growth",
      },
      xSeriesConfig: { key: "Trade", name: "Trade" },

      seriesConfig: [
        {
          key: "Capital",
          name: "Captial",
          tooltipLabel: "Capital",
          color: "var(--warning)",
          markerColor: "var(--warning)",
          areaColor: "var(--warning)",
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
        ...DEFAULT_LINE_CHART_LAYOUT,
        title: "Pnl Growth",
      },

      xSeriesConfig: { key: "Date", name: "Date" },

      seriesConfig: [
        {
          key: "Profit",
          name: "Profit",
          tooltipLabel: "Profit",
          color: "var(--success)",
          markerColor: "var(--success)",
          areaColor: "var(--success)",
        },
        {
          key: "Loss",
          name: "Loss",
          tooltipLabel: "Loss",
          color: "var(--error)",
          markerColor: "var(--error)",
          areaColor: "var(--error)",
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
      layout: { ...DEFAULT_RADIAL_BAR_CHART_LAYOUT, title: "Radial Progress" },
      seriesConfig: [
        {
          key: "Wins",
          name: "Wins",
          tooltipLabel: "Wins",
          color: "var(--success)",
        },
        {
          key: "Loses",
          name: "Loses",
          tooltipLabel: "Loses",
          color: "var(--error)",
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
      layout: { ...DEFAULT_PIE_CHART_LAYOUT, title: "Pie Progress" },
      seriesConfig: [
        {
          key: "Wins",
          name: "Wins",
          tooltipLabel: "Wins",
          color: "var(--info)",
        },
        {
          key: "Loses",
          name: "Loses",
          tooltipLabel: "Loses",
          color: "var(--warning)",
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
      layout: { ...DEFAULT_RADAR_CHART_LAYOUT, title: "Radar Progress" },
      seriesConfig: [
        {
          key: "Reward",
          name: "Reward",
          tooltipLabel: "Reward",
          color: "var(--success)",
          prefix: "1:",
          suffix: "",
        },
        {
          key: "Risk",
          name: "Risk",
          tooltipLabel: "Risk",
          color: "var(--error)",
          prefix: "1:",
          suffix: "",
        },
        {
          key: "Gain",
          name: "Gain",
          tooltipLabel: "Gain",
          color: "var(--info)",
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
        ...DEFAULT_POLARAREA_CHART_LAYOUT,
        title: "Market Polar Strength",
      },

      seriesConfig: [
        {
          key: "data",
          name: "Momentum",
          tooltipLabel: "Momentum",
          color: "var(--info)",
          prefix: "",
          suffix: "%",
        },
        {
          key: "data",
          name: "Volume",
          tooltipLabel: "Volume",
          color: "var(--warning)",
          prefix: "",
          suffix: "%",
        },
        {
          key: "data",
          name: "Volatility",
          tooltipLabel: "Volatility",
          color: "var(--error)",
          prefix: "",
          suffix: "%",
        },
      ],
    },
  },
};
