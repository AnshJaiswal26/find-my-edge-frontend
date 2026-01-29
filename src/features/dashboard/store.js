import { createChart } from "@charts/apex/model/factory";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { computeOverSequence } from "@lib/analytics/engine/execute";
import { FUNCTION_REGISTRY } from "@lib/analytics/engine/functions/registry";
import { useTradeStore, useUIStore } from "@stores";
import { evaluateColorRules } from "@utils";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

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

  {
    title: "Win Streak",
    key: "pnl",
    type: "number",
    aggregate: "MAX_WIN_STREAK_N",
    format: "NUMBER",
    value: 0,
    colorRules: [{ operator: "always", color: "var(--success)" }],
  },

  {
    title: "Loss Streak",
    key: "pnl",
    type: "number",
    aggregate: "MAX_LOSE_STREAK_N",
    format: "NUMBER",
    value: 0,
    colorRules: [{ operator: "always", color: "var(--error)" }],
  },
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
    type: "time computed",
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
  },
  {
    title: "Max Loss",
    key: "pnl",
    type: "number",
    aggregate: "MIN_N",
    format: "CURRENCY_SIGNED",
    value: 0,
  },
  {
    title: "Avg Win",
    key: "pnl",
    type: "number",
    aggregate: "AVG_WIN_N",
    format: "CURRENCY_SIGNED",
    value: 0,
  },
  {
    title: "Avg Loss",
    key: "pnl",
    type: "number",
    aggregate: "AVG_LOSS_N",
    format: "CURRENCY_SIGNED",
    value: 0,
  },
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

    lastSeenVerison: 0,

    openPopup(id) {
      set({ activePopup: id });
    },

    closePopup() {
      set({ activePopup: null });
    },

    recomputeAll() {
      set((state) => {
        const { seriesById, seriesOrder, schemasById } = state;

        Object.values(schemasById).forEach((schema) => {
          computeOverSequence({
            tradesById: seriesById,
            sequenceIds: seriesOrder,
            schema,
            getValue: (trade, key) => trade[key],
            setValue: (trade, schema, value) => {
              trade[schema.id] = value;
            },
            usePrev: schema.mode !== "row",
          });
        });
      });

      get().loadInitialCharts();
      get().recomputeStats();
    },

    hydrateSchema() {
      const { schemasById, schemaOrder } = useTradeStore.getState();
      set({ schemasById: { ...schemasById }, schemaOrder: [...schemaOrder] });
    },

    hydrateFromTrades() {
      const { tradeOrder, tradesById } = useTradeStore.getState();
      const { hydrateSchema, recomputeAll } = get();

      // always keep schemas in sync
      hydrateSchema();

      set({ seriesOrder: [...tradeOrder], seriesById: { ...tradesById } });

      recomputeAll();
    },

    recomputeStats() {
      set((s) => {
        s.stats.forEach((stat) => {
          const reducer = FUNCTION_REGISTRY[stat.aggregate].reducer;
          const acc = reducer.init(s.seriesOrder.length);

          s.seriesOrder.forEach((id) => {
            reducer.step(acc, s.seriesById[id][stat.key]);
          });

          stat.value = reducer.result(acc);
        });
      });
    },

    loadInitialCharts() {
      const { order, seriesById, seriesOrder } = get();
      if (order.length > 0) return;

      const seriesConfig = [
        {
          key: "Wins",
          name: "Wins",
          type: "number",
          tooltipLabel: "Wins",
          color: "var(--info)",
        },
        {
          key: "Loses",
          name: "Loses",
          type: "number",
          tooltipLabel: "Loses",
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

        donut: createChart("donut", {
          layout: {
            format: "PERCENT",
          },
          seriesConfig,
          series: seriesConfig.map((s) => {
            if (s.key === "Wins") {
              return (
                (seriesOrder.reduce((acc, id) => {
                  acc = seriesById[id].pnl > 0 ? acc + 1 : acc;
                  return acc;
                }, 0) /
                  seriesOrder.length) *
                100
              );
            }
            return (
              (seriesOrder.reduce((acc, id) => {
                acc = seriesById[id].pnl < 0 ? acc + 1 : acc;
                return acc;
              }, 0) /
                seriesOrder.length) *
              100
            );
          }),
        }),

        radialBar: createChart("radialBar", {
          layout: { format: "PERCENT" },
          seriesConfig,
          series: seriesConfig.map((s) => {
            if (s.key === "Wins") {
              return (
                (seriesOrder.reduce((acc, id) => {
                  acc = seriesById[id].pnl > 0 ? acc + 1 : acc;
                  return acc;
                }, 0) /
                  seriesOrder.length) *
                100
              );
            }
            return (
              (seriesOrder.reduce((acc, id) => {
                acc = seriesById[id].pnl < 0 ? acc + 1 : acc;
                return acc;
              }, 0) /
                seriesOrder.length) *
              100
            );
          }),
        }),
      };

      useChartStore.setState((s) => {
        ["bar", "line", "donut", "radialBar"].map((ch) => {
          s[map[ch].meta.id] = map[ch];
        });
      });
      set((s) => {
        ["bar", "line", "donut", "radialBar"].map((ch) => {
          s.order.push({
            id: map[ch].meta.id,
            category: map[ch].meta.category,
            type: map[ch].meta.type,
          });
        });
      });
    },

    addChart(type, config) {
      const chart = createChart(type, config);

      useChartStore.setState((cs) => {
        cs[chart.meta.id] = chart;
      });

      console.log(chart);

      set((s) => {
        s.order.push({
          id: chart.meta.id,
          category: chart.meta.category,
          type: chart.meta.type,
        });
      });
      get().closePopup();
    },

    addStats(stat) {
      const { stats } = get();

      if (stats.length > 19) {
        useUIStore
          .getState()
          .showToast("ERROR", "You cannot add more than 20 stats");
        return;
      }
      console.log(stat);
      set((s) => {
        const reducer = FUNCTION_REGISTRY[stat.aggregate].reducer;
        const state = reducer.init(s.seriesOrder.length);

        s.seriesOrder.forEach((id) => {
          reducer.step(state, s.seriesById[id][stat.key]);
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
