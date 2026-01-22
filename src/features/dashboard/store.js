import { createChart } from "@charts/apex/model/factory";
import { useTradeStore } from "@stores";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const stat = {
  key: "pnl",
  aggregate: "SUM_N",
  format: "CURRENCY",
};

export const useDashboardStore = create(
  immer((set, get) => ({
    activePopup: null,

    seriesById: {},
    seriesOrder: [],
    schemasById: {},
    schemaOrder: [],

    recompute() {
      set((state) => {
        const { seriesById, seriesOrder, schemasById } = state;
        Object.values(schemasById).forEach((schema) => {
          computeSchema({
            tradesById: seriesById,
            tradeOrder: seriesOrder,
            schema,
            getValue: (trade, key) => trade[key],
            setValue: (trade, value) => {
              trade[schema.id] = value;
            },
          });
        });
      });

      get().loadInitialCharts();
    },

    hydrateSchema() {
      const { schemasById, schemaOrder } = useTradeStore.getState();
      set({ schemasById: { ...schemasById }, schemaOrder: [...schemaOrder] });
    },

    hydrateFromTrades() {
      const { hydrateSchema, recompute } = get();
      hydrateSchema();

      const { tradesById, tradeOrder } = useTradeStore.getState();

      if (!tradeOrder.length) return;

      const seriesOrder = [...tradeOrder];
      const seriesById = { ...tradesById };

      set({ seriesById, seriesOrder });

      recompute();
    },

    loadInitialCharts() {
      const { order, seriesById, seriesOrder } = get();
      if (order.length > 0) return;

      const seriesConfig = [
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
      ];

      const map = {
        bar: createChart("bar", {
          layout: {
            xTitleText: "Trades",
            yTitleText: "Risk/Reward",
            yLabelPrefix: "1:",
            title: "P&L Booked on Risk/Reward",
          },
          x: { key: "date", name: "Date" },
          y: [
            {
              key: "riskReward",
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
        }),

        line: createChart("line", {
          layout: {
            xTitleText: "Date",
            yTitleText: "Pnl",
            yLabelPrefix: "₹",
            title: "P&L Over Time",
          },
          x: { key: "entryTime", name: "Entry Time" },
          y: [
            {
              key: "pnl",
              name: "Pnl",
              tooltipLabel: "Pnl",
              color: "var(--cyan)",
              markerColor: "var(--cyan)",
              areaColor: "var(--cyan)",
            },
            // {
            //   key: "cumulativePnl",
            //   name: "Cummulative Pnl",
            //   tooltipLabel: "Cummulative Pnl",
            //   color: "var(--warning)",
            //   markerColor: "var(--warning)",
            //   areaColor: "var(--warning)",
            // },
          ],
        }),

        donut: createChart("donut", {
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

      console.log(map.donut);

      set((s) => {
        ["bar", "line", "donut", "radialBar"].map((ch) => {
          s[map[ch].meta.id] = map[ch];
          s.order.push({
            id: map[ch].meta.id,
            category: map[ch].meta.category,
            type: map[ch].meta.type,
          });
        });
      });
    },

    stats: [],

    addStats(stat) {
      set((s) => {
        s.stats.push(stat);
      });
    },
  })),
);
