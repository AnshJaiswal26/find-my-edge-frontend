import { createChart } from "@charts/apex/model/factory";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions/registry";
import { buildAST, tokenize, toPostfix } from "@lib/expression";
import { useTradeStore, useUIStore } from "@stores";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

function makeAST(expr) {
  const ast = buildAST(toPostfix(tokenize(expr)), "GLOBAL").ast;
  return ast;
}

const stats = [
  {
    title: "Pnl",
    key: "pnl",
    type: "number",
    aggregate: "SUM_N",
    format: "CURRENCY_SIGNED",
    value: 0,
    color: null,
  },

  // {
  //   title: "Win Streak",
  //   key: "pnl",
  //   type: "number",
  //   aggregate: "MAX_WIN_STREAK_N",
  //   format: "NUMBER",
  //   value: 0,
  //   colorRules: [{ operator: "always", color: "var(--success)" }],
  // },

  // {
  //   title: "Loss Streak",
  //   key: "pnl",
  //   type: "number",
  //   aggregate: "MAX_LOSE_STREAK_N",
  //   format: "NUMBER",
  //   value: 0,
  //   colorRules: [{ operator: "always", color: "var(--error)" }],
  // },
  {
    title: "Avg Risk/Reward",
    key: "riskReward",
    type: "number",
    aggregate: "AVG_N",
    format: "RATIO",
    value: 0,
  },

  {
    title: "Avg Holding Time",
    key: "duration",
    type: "duration",
    aggregate: "AVG_N",
    format: "HH:mm:ss",
    value: 0,
  },
  {
    title: "Max Profit",
    key: "pnl",
    type: "number",
    aggregate: "MAX_N",
    format: "CURRENCY_SIGNED",
    value: 0,
    colorRules: [{ operator: "always", color: "var(--success)" }],
  },
  {
    title: "Max Loss",
    key: "pnl",
    type: "number",
    aggregate: "MIN_N",
    format: "CURRENCY_SIGNED",
    value: 0,
    colorRules: [{ operator: "always", color: "var(--error)" }],
  },
  // {
  //   title: "Avg Win",
  //   key: "pnl",
  //   type: "number",
  //   aggregate: "AVG_WIN_N",
  //   format: "CURRENCY_SIGNED",
  //   value: 0,
  //   colorRules: [{ operator: "always", color: "var(--success)" }],
  // },
  // {
  //   title: "Avg Loss",
  //   key: "pnl",
  //   type: "number",
  //   aggregate: "AVG_LOSS_N",
  //   format: "CURRENCY_SIGNED",
  //   value: 0,
  //   colorRules: [{ operator: "always", color: "var(--error)" }],
  // },
];

export const useDashboardStore = create(
  immer((set, get) => ({
    activePopup: null,

    seriesById: {},
    seriesOrder: [],
    schemasById: {},
    schemaOrder: [],
    order: [],
    stats: [...stats],

    openPopup(id) {
      set({ activePopup: id });
    },

    closePopup() {
      set({ activePopup: null });
    },

    recomputeStats() {
      const { tradeOrder, tradesById } = useTradeStore.getState();
      set((s) => {
        s.stats.forEach((stat) => {
          const reducer = FUNCTION_REGISTRY[stat.aggregate].reducer;
          const acc = reducer.init(tradeOrder.length);

          tradeOrder.forEach((id) => {
            reducer.step(acc, tradesById[id][stat.key]);
          });

          stat.value = reducer.result(acc);
        });
      });
    },

    loadInitialCharts() {
      const { order, recomputeStats } = get();
      recomputeStats();
      if (order.length > 0) return;

      const seriesConfig = [
        {
          key: "WIN_RATE",
          name: "Win Rate",
          type: "number",
          ast: makeAST("WIN_RATE()"), // ✅ AST
          exprString: "RATE(pnl > 0) * 100", // optional UI
          tooltipLabel: "Wins",
          color: "var(--info)",
        },
        {
          key: "LOSS_RATE",
          name: "Loss Rate",
          type: "number",
          ast: makeAST("LOSS_RATE()"),
          exprString: "RATE(pnl < 0) * 100",
          tooltipLabel: "Losses",
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
            yLabelPrefix: "1:",
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
            yLabelPrefix: "₹",
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
              tooltipLabel: "Profit Factor",
              color: "var(--success)",
            },
            {
              key: "LOSS_FACTOR",
              name: "Loss Factor",
              type: "number",
              ast: makeAST("ABS(SUM_NEGATIVE(pnl)) / SUM_POSITIVE(pnl)"),
              exprString: "ABS(SUM_NEGATIVE(pnl)) / SUM_POSITIVE(pnl)",
              tooltipLabel: "Loss Factor",
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
              exprString: "SUM_POSITIVE(pnl) / ABS(SUM_NEGATIVE(pnl))",
              tooltipLabel: "Profit Factor",
              color: "var(--success)",
            },
            {
              key: "LOSS_FACTOR",
              name: "Loss Factor",
              type: "number",
              ast: makeAST("ABS(SUM_NEGATIVE(pnl)) / SUM_POSITIVE(pnl)"),
              exprString: "ABS(SUM_NEGATIVE(pnl)) / SUM_POSITIVE(pnl)",
              tooltipLabel: "Loss Factor",
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
              tooltipLabel: "Reward",
              color: "var(--success)",
              prefix: "1:",
              suffix: "",
            },
            {
              key: 1,
              name: "Risk",
              tooltipLabel: "Risk",
              color: "var(--error)",
              prefix: "1:",
              suffix: "",
            },
            {
              key: 2,
              name: "Gain",
              tooltipLabel: "Gain",
              color: "var(--info)",
              prefix: "",
              suffix: "%",
            },
          ],
        }),
      };

      useChartStore.setState((s) => {
        ["bar", "line", "donut1", "donut2", "radialBar", "radar"].map((ch) => {
          s[map[ch].meta.id] = map[ch];
        });
      });
      set((s) => {
        ["bar", "line", "donut1", "donut2", "radialBar", "radar"].map((ch) => {
          s.order.push({
            id: map[ch].meta.id,
            category: map[ch].meta.category,
            type: map[ch].meta.type,
          });
        });
      });
    },

    addChart(type, config) {
      const { closePopup } = get();
      const chart = createChart(type, config);

      useChartStore.setState((cs) => {
        cs[chart.meta.id] = chart;
      });

      set((s) => {
        s.order.push({
          id: chart.meta.id,
          category: chart.meta.category,
          type: chart.meta.type,
        });
      });
      closePopup();
    },

    deleteChart(chartId) {},

    addStats(stat) {
      const { stats } = get();
      const { tradeOrder, tradesById } = useTradeStore.getState();

      if (stats.length > 19) {
        useUIStore
          .getState()
          .showToast("ERROR", "You cannot add more than 20 stats");
        return;
      }
      console.log(stat);
      set((s) => {
        const reducer = FUNCTION_REGISTRY[stat.aggregate].reducer;
        const state = reducer.init(tradeOrder.length);

        tradeOrder.forEach((id) => {
          reducer.step(state, tradesById[id][stat.key]);
        });

        const result = reducer.result(state);

        s.stats.push({
          ...stat,
          value: result,
        });
      });
      get().closePopup();
    },
  })),
);
