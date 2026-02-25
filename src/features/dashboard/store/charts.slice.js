import { createChart } from "@modules/charts/apex/model/factory";
import { useChartStore } from "@modules/charts/apex/store";
import { makeAST } from "@lib/expression";

export const createChartsSlice = (set, get) => ({
  order: [],

  loadInitialCharts() {
    const { order, fetchStats } = get();
    fetchStats();
    if (order.length > 0) return;

    const seriesConfig = [
      {
        key: "WIN_RATE",
        name: "Win Rate",
        type: "number",
        ast: makeAST("WIN_RATE()"), // AST
        exprString: "RATE(pnl > 0) * 100", // optional UI
        label: "Wins",
        color: "var(--info)",
      },
      {
        key: "LOSS_RATE",
        name: "Loss Rate",
        type: "number",
        ast: makeAST("LOSS_RATE()"),
        exprString: "RATE(pnl < 0) * 100",
        label: "Losses",
        color: "var(--warning)",
      },
    ];

    const map = {
      bar: createChart("bar", {
        layout: {
          xTitleText: "Trades",
          xFormat: "YYYY-MM-DD",
          yTitleText: "Risk/Reward",
          yFormat: "RATIO",
          title: "P&L Booked on Risk/Reward",
        },
        x: { key: "date", name: "Date", type: "date" },
        y: [
          {
            key: "riskReward",
            name: "Risk/Reward",
            type: "number",
            colorRules: [
              {
                operator: "greaterThan",
                value: 0.6,
                value2: 0,
                color: "var(--success)",
                label: "Reward Taken",
              },
              {
                operator: "greaterThan",
                value: 0,
                value2: 0,
                color: "var(--warning)",
                label: "Breakeven",
              },
              {
                operator: "lessThan",
                value: 0,
                value2: 0,
                color: "var(--error)",
                label: "Risk Taken",
              },
            ],
          },
        ],
      }),

      line: createChart("line", {
        layout: {
          xTitleText: "Date",
          xFormat: "hh:mm:ss A",
          yTitleText: "Pnl",
          yFormat: "CURRENCY",
          title: "P&L Over Time",
        },
        x: { key: "entryTime", name: "Entry Time", type: "time" },
        y: [
          {
            key: "pnl",
            name: "Pnl",
            type: "number",
            label: "Pnl",
            color: "var(--cyan)",
            markerColor: "var(--cyan)",
            areaColor: "var(--cyan)",
          },
        ],
      }),

      donut1: createChart("donut", {
        layout: { format: "PERCENT" },
        seriesConfig,
      }),

      donut2: createChart("donut", {
        layout: { format: "NUMBER" },
        seriesConfig: [
          {
            key: "PROFIT_FACTOR",
            name: "Profit Factor",
            type: "number",
            ast: makeAST("SUM_POSITIVE(pnl) / ABS(SUM_NEGATIVE(pnl))"),
            exprString: "SUM_POSITIVE(pnl) / ABS(SUM_NEGATIVE(pnl))",
            label: "Profit Factor",
            color: "var(--success)",
          },
          {
            key: "LOSS_FACTOR",
            name: "Loss Factor",
            type: "number",
            ast: makeAST("ABS(SUM_NEGATIVE(pnl)) / SUM_POSITIVE(pnl)"),
            exprString: "ABS(SUM_NEGATIVE(pnl)) / SUM_POSITIVE(pnl)",
            label: "Loss Factor",
            color: "var(--error)",
          },
        ],
      }),

      donut3: createChart("donut", {
        layout: { format: "NUMBER" },
        seriesConfig: [
          {
            key: "PROFIT_FACTOR",
            name: "Profit Factor",
            type: "number",
            ast: makeAST("SUM_POSITIVE(pnl) / ABS(SUM_NEGATIVE(pnl))"),
            label: "Profit Factor",
            color: "var(--success)",
          },
          {
            key: "LOSS_FACTOR",
            name: "Loss Factor",
            type: "number",
            ast: makeAST("ABS(SUM_NEGATIVE(pnl)) / SUM_POSITIVE(pnl)"),
            label: "Loss Factor",
            color: "var(--error)",
          },
        ],
      }),

      radialBar: createChart("radialBar", {
        layout: { format: "PERCENT" },
        seriesConfig,
      }),

      radar: createChart("radar", {
        layout: {
          title: "Trade Metrics Radar",
          yFormat: "NUMBER",
        },
        series: [
          {
            key: 0,
            name: "Reward",
            label: "Reward",
            color: "var(--success)",
            prefix: "1:",
            suffix: "",
          },
          {
            key: 1,
            name: "Risk",
            label: "Risk",
            color: "var(--error)",
            prefix: "1:",
            suffix: "",
          },
          {
            key: 2,
            name: "Gain",
            label: "Gain",
            color: "var(--info)",
            prefix: "",
            suffix: "%",
          },
        ],
      }),
    };

    useChartStore.setState((s) => {
      ["bar", "line", "donut1", "donut2", "radialBar", "radar"].map((ch) => {
        s.charts[map[ch].meta.id] = map[ch];
      });
    });
    set((s) => {
      ["bar", "line", "donut1", "donut2", "radialBar", "radar"].map((ch) => {
        s.order.push(map[ch].meta.id);
      });
    });
  },

  addChart(type, config) {
    const { closePopup } = get();
    const chart = createChart(type, config);

    useChartStore.setState((cs) => {
      cs.charts[chart.meta.id] = chart;
    });

    set((s) => {
      s.order.push(chart.meta.id);
    });
    closePopup();
  },

  deleteChart(chartId) {},
});
