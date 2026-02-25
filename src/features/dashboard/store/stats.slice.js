import { useTradeStore, useUIStore } from "@shared/stores";
import { DURATION_FORMAT, NUMBER_FORMAT } from "@shared/utils";
import { makeAST } from "@lib/expression";
import { SCHEMA_TYPES } from "@lib/analytics/schema";
import { computeAggregate } from "@lib/analytics/engine/execute";
import { statService } from "@lib/services/stat.service";

const computeStat = (ast, store) => {
  const { tradesOrder, tradesById, derivedByTradeId, schemasById } = store;

  return computeAggregate({
    ast,
    getTradeValue: (index, key) => {
      if (index < 0) return null;
      const id = tradesOrder[index];
      console.log(derivedByTradeId[id], tradesById[id]);
      return id ? (derivedByTradeId[id]?.[key] ?? tradesById[id]?.[key]) : null;
    },
    getTradeCount: () => tradesOrder.length,
    getSchemaType: (key) => {
      const schema = schemasById[key];
      return {
        format: schema?.display?.format,
        type: schema?.semanticType,
      };
    },
  });
};

export const createStatsSlice = (set, get) => ({
  statsById: {
    "stat-1": {
      id: "stat-1",
      title: "Pnl",
      type: SCHEMA_TYPES.NUMBER,
      ast: makeAST("SUM(pnl)"),
      format: NUMBER_FORMAT.COMPACT_CURRENCY_SIGNED,
      value: 0,
      colorRules: [
        { operator: "greaterThan", value: 0, color: "var(--success)" },
        { operator: "lessThan", value: 0, color: "var(--error)" },
      ],
    },
    "stat-2": {
      id: "stat-2",
      title: "Avg Risk/Reward",
      type: SCHEMA_TYPES.NUMBER,
      ast: makeAST("AVG(riskReward)"),
      format: NUMBER_FORMAT.RATIO,
      value: 0,
    },
    "stat-3": {
      id: "stat-3",
      title: "Avg Holding Time",
      type: SCHEMA_TYPES.DURATION,
      ast: makeAST("AVG(duration)"),
      format: DURATION_FORMAT.HH_MM_SS,
      value: 0,
    },
    "stat-4": {
      id: "stat-4",
      title: "Max Profit",
      type: SCHEMA_TYPES.NUMBER,
      ast: makeAST("MAX(pnl)"),
      format: NUMBER_FORMAT.CURRENCY_SIGNED,
      value: 0,
    },
    "stat-5": {
      id: "stat-5",
      title: "Max Loss",
      type: SCHEMA_TYPES.NUMBER,
      ast: makeAST("MIN(pnl)"),
      format: NUMBER_FORMAT.CURRENCY_SIGNED,
      value: 0,
    },
    "stat-6": {
      id: "stat-6",
      title: "win rate",
      type: SCHEMA_TYPES.NUMBER,
      ast: makeAST("WIN_RATE()"),
      format: NUMBER_FORMAT.PERCENT,
      value: 0,
    },
  },
  statsOrder: ["stat-1", "stat-2", "stat-3", "stat-4", "stat-5", "stat-6"],

  statLoading: {
    create: false,
    update: false,
    delete: false,
  },

  /* ---------------- RECOMPUTE ---------------- */
  recomputeStats() {
    const tradeStore = useTradeStore.getState();

    set((s) => {
      s.statsOrder.forEach((id) => {
        const stat = s.statsById[id];
        if (!stat) return;
        stat.value = computeStat(stat.ast, tradeStore);
        console.log(stat.value);
      });
    });
  },

  /* ---------------- FETCH ---------------- */
  async fetchStats() {
    try {
      const res = await statService.getAll("dashboard"); // UPDATED

      console.log(res);
      const statsById = res.statsById || {};
      const statsOrder = res.statsOrder || [];

      set((s) => {
        s.statsById = { ...statsById };
        s.statsOrder = [...statsOrder];
      });

      get().recomputeStats();
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
    }
  },

  /* ---------------- ADD ---------------- */
  async addStat(stat) {
    const { statsOrder } = get();
    const tradeStore = useTradeStore.getState();

    if (statsOrder.length > 19) {
      useUIStore
        .getState()
        .showToast("ERROR", "You cannot add more than 20 stats");
      return;
    }

    const value = computeStat(stat.ast, tradeStore);

    //  optimistic update
    set((s) => {
      s.statsById[stat.id] = { ...stat, value };
      s.statsOrder.push(stat.id);
    });

    try {
      await statService.create("dashboard", stat); // UPDATED
      get().closePopup();
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);

      // rollback
      set((s) => {
        delete s.statsById[stat.id];
        const i = s.statsOrder.indexOf(stat.id);
        if (i !== -1) s.statsOrder.splice(i, 1);
      });
    }
  },

  /* ---------------- UPDATE ---------------- */
  async updateStat(page, id, updates) {
    const tradeStore = useTradeStore.getState();

    let prev;

    set((s) => {
      const stat = s.statsById[id];
      if (!stat) return;

      prev = { ...stat };

      Object.assign(stat, updates);

      if (updates.ast) {
        stat.value = computeStat(stat.ast, tradeStore);
      }
    });

    try {
      await statService.update(page, id, updates); //  UPDATED
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);

      set((s) => {
        if (prev) s.statsById[id] = prev;
      });
    }
  },

  /* ---------------- DELETE ---------------- */
  /* ---------------- DELETE ---------------- */
  async deleteStat(id) {
    try {
      await statService.delete("dashboard", id);

      // ✅ update only after success
      set((s) => {
        delete s.statsById[id];

        const index = s.statsOrder.indexOf(id);
        if (index !== -1) {
          s.statsOrder.splice(index, 1);
        }
      });
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
    }
  },

  /* ---------------- UPDATE ORDER ---------------- */
  async updateStatsOrder(page, order) {
    const prev = get().statsOrder;

    set({ statsOrder: order });

    try {
      await statService.updateOrder(page, order); //  UPDATED
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);

      set({ statsOrder: prev });
    }
  },
});
