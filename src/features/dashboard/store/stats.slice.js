import { useTradeStore, useUIStore } from "@shared/stores";
import { computeAggregate } from "@lib/analytics/engine/execute";
import { statService } from "@features/dashboard/services/stat.service";
import { PAGE_CONFIG } from "@pages/config/pageConfig";
import { TOAST } from "@shared/constants";
import { toast } from "@shared/services/toast.service";

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
  statsById: {},
  statsOrder: {},

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

  /* ---------------- ADD ---------------- */
  async addStat(stat) {
    const { statsOrder } = get();
    const tradeStore = useTradeStore.getState();

    if (statsOrder.length > 19) {
      useUIStore
        .getState()
        .showToast(TOAST.ERROR, "You cannot add more than 20 stats");
      return;
    }

    const value = computeStat(stat.ast, tradeStore);

    //  optimistic update
    set((s) => {
      s.statsById[stat.id] = { ...stat, value };
      s.statsOrder.push(stat.id);
    });

    try {
      await statService.create(PAGE_CONFIG.DASHBOARD.key, stat); // UPDATED
      get().closePopup();
    } catch (err) {
      toast.error(err.message);

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
      toast.error(err.message);

      set((s) => {
        if (prev) s.statsById[id] = prev;
      });
    }
  },

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
      toast.error(err.message);
    }
  },

  /* ---------------- UPDATE ORDER ---------------- */
  async updateStatsOrder(page, order) {
    const prev = get().statsOrder;

    set({ statsOrder: order });

    try {
      await statService.updateOrder(page, order);
    } catch (err) {
      toast.error(err.message);

      set({ statsOrder: prev });
    }
  },

  updateComputedStats(statValues) {
    set((s) => {
      Object.entries(statValues).forEach(([id, value]) => {
        if (s.statsById[id]) {
          s.statsById[id].value = value;
        }
      });
    });
  },
});
