import { useTradeStore, useUIStore } from "@stores";
import { DURATION_FORMAT, NUMBER_FORMAT } from "@utils";
import { makeAST } from "@lib/expression";
import { SCHEMA_TYPES } from "@lib/analytics/schema";
import { computedAggregate } from "@lib/analytics/engine/execute";

const computeStat = (ast, store) => {
  const { tradesOrder, tradesById, derivedByTradeId, schemasById } = store;

  return computedAggregate({
    ast,
    getTradeValue: (index, key) => {
      if (index < 0) return null;
      const id = tradesOrder[index];
      return id ? (derivedByTradeId[id]?.[key] ?? tradesById[id]?.[key]) : null;
    },
    getTradeCount: () => tradesOrder.length,
    getSchemaType: (key) => {
      const schema = schemasById[key];
      return {
        format: schema?.display?.format,
        type: schema.semanticType,
      };
    },
  });
};

export const createStatsSlice = (set, get) => ({
  statsById: {
    "stat-1": {
      title: "Pnl",
      type: SCHEMA_TYPES.NUMBER,
      ast: makeAST("SUM(pnl)"),
      format: NUMBER_FORMAT.COMPACT_SIGNED,
      value: 0,
      colorRules: [
        { operator: "greaterThan", value: 0, color: "var(--success)" },
        { operator: "lessThan", value: 0, color: "var(--error)" },
      ],
    },

    "stat-2": {
      title: "Avg Risk/Reward",
      type: SCHEMA_TYPES.NUMBER,
      ast: makeAST("AVG(riskReward)"),
      format: NUMBER_FORMAT.RATIO,
      value: 0,
    },
    "stat-3": {
      title: "Avg Holding Time",
      type: SCHEMA_TYPES.DURATION,
      ast: makeAST("AVG(duration)"),
      format: DURATION_FORMAT.HH_MM_SS,
      value: 0,
    },
    "stat-4": {
      title: "Max Profit",
      type: SCHEMA_TYPES.NUMBER,
      ast: makeAST("MAX(pnl)"),
      format: NUMBER_FORMAT.CURRENCY_SIGNED,
      value: 0,
    },
    "stat-5": {
      title: "Max Loss",
      type: SCHEMA_TYPES.NUMBER,
      ast: makeAST("MIN(pnl)"),
      format: NUMBER_FORMAT.CURRENCY_SIGNED,
      value: 0,
    },

    "stat-6": {
      title: "win rate",
      type: SCHEMA_TYPES.NUMBER,
      ast: makeAST("WIN_RATE()"),
      format: NUMBER_FORMAT.PERCENT,
      value: 0,
    },
  },
  statsOrder: ["stat-1", "stat-2", "stat-3", "stat-4", "stat-5", "stat-6"],

  recomputeStats() {
    const tradeStore = useTradeStore.getState();

    set((s) => {
      s.statsOrder.forEach((id) => {
        const stat = s.statsById[id];
        if (!stat) return;
        stat.value = computeStat(stat.ast, tradeStore);
      });
    });
  },

  addStats(stat) {
    const { statsOrder } = get();
    const tradeStore = useTradeStore.getState();

    if (statsOrder.length > 19) {
      useUIStore
        .getState()
        .showToast("ERROR", "You cannot add more than 20 stats");
      return;
    }

    set((s) => {
      s.statsOrder.push(stat.id);
      const value = computeStat(stat.ast, tradeStore);
      console.log(value);
      Object.assign(stat, { value });
      s.statsById[stat.id] = stat;
    });

    get().closePopup();
  },
});
