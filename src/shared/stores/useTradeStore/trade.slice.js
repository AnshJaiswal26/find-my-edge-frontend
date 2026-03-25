import { debounce } from "lodash";
import { createRow } from "@features/trade-metrics/table/model";

import { tradeService } from "@shared/services/trade.service";
import { useDashboardStore } from "@features/dashboard/store";
import { useChartStore } from "@modules/charts/apex/store";
import { toast } from "@shared/services/toast.service";

export const createTradeSlice = (set, get) => ({
  pendingUpdates: {},
  pendingCreates: {},
  pendingDeletes: new Set(),

  updateTradeValue(rowId, colId, value) {
    const {
      tradesById,
      schemasById,
      affectedMap,
      recompute,
      queueTradeUpdate,
    } = get();

    const schema = schemasById[colId];
    if (!schema) return;

    const currentValue = tradesById[rowId]?.[colId];

    if (currentValue === value) return;

    //  1. update raw value
    set((s) => {
      if (!s.tradesById[rowId]) return;
      s.tradesById[rowId][colId] = value;
    });

    //  2. recompute dependent columns
    if (affectedMap?.[colId]) {
      recompute({
        reason: "value",
        tradeId: rowId,
        schemaId: colId,
      });
    }

    //  3. queue backend update (optional)
    queueTradeUpdate(rowId, {
      [colId]: value,
    });
  },

  addTrade() {
    const id = crypto.randomUUID();
    const trade = createRow(get().schemasById);

    set((s) => {
      s.tradesById[id] = { id, ...trade };
      s.tradesOrder.push(id);

      s.pendingCreates[id] = { id, ...trade };
    });

    get().debouncedSync();
  },

  updateTrade(id, patch) {
    set((s) => {
      Object.assign(s.tradesById[id], patch);
    });
  },

  deleteTrade(tradeId) {
    const { debouncedSync, recompute } = get();

    let tradeIndex = 0;

    set((s) => {
      delete s.tradesById[tradeId];

      s.tradesOrder = s.tradesOrder.filter((id, i) => {
        if (id === tradeId) tradeIndex = i;
        return id !== tradeId;
      });

      // track delete
      s.pendingDeletes.add(tradeId);

      // remove if it was just created
      delete s.pendingCreates[tradeId];
    });

    recompute({ reason: "trade-delete", tradeIndex });
    debouncedSync();
  },

  queueTradeUpdate: (id, patch) => {
    set((s) => {
      if (!s.pendingUpdates[id]) {
        s.pendingUpdates[id] = {};
      }
      Object.assign(s.pendingUpdates[id], patch);
    });

    get().debouncedSync(); // trigger background sync
  },

  applyTradeUpdates(updates) {
    set((s) => {
      for (const [id, patch] of Object.entries(updates)) {
        if (!s.derivedByTradeId[id]) continue;

        s.derivedByTradeId[id] = {
          ...s.derivedByTradeId[id],
          ...patch,
        };
      }
    });
  },

  debouncedSync: debounce(async () => {
    const {
      pendingUpdates,
      pendingCreates,
      pendingDeletes,
      applyTradeUpdates,
    } = get();

    if (
      !Object.keys(pendingUpdates).length &&
      !Object.keys(pendingCreates).length &&
      !pendingDeletes.size
    )
      return;

    set({ isSaving: true });

    try {
      const updates = { ...pendingUpdates };
      const creates = { ...pendingCreates };
      const deletes = new Set(pendingDeletes);

      // clear optimistically
      set({
        pendingUpdates: {},
        pendingCreates: {},
        pendingDeletes: new Set(),
      });

      //  SINGLE SERVICE CALL

      const results = await tradeService.sync({ creates, updates, deletes });

      console.log("Sync results", results);

      results.forEach((result) => {
        if (!result) return;

        const { statValues, seriesValues, tradeUpdates } = result;

        if (tradeUpdates) {
          applyTradeUpdates(tradeUpdates);
        }

        if (statValues) {
          useDashboardStore.getState()?.updateComputedStats?.(statValues);
        }

        if (seriesValues) {
          useChartStore.getState()?.updateComputedSeries?.(seriesValues);
        }
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      set({ isSaving: false });
    }
  }, 800),
});
