import { debounce } from "lodash";
import { useUIStore } from "@shared/stores";
import { createRow } from "@features/trade-metrics/table/model";

import { tradeService } from "@shared/services/trade.service";

export const createTradeSlice = (set, get) => ({
  pendingUpdates: {},
  pendingCreates: {},
  pendingDeletes: new Set(),

  updateTradeValue(rowId, colId, value) {
    const { tradesById, schemasById, affectedMap } = get();

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
      get().recompute({
        reason: "value",
        tradeId: rowId,
        schemaId: colId,
      });
    }

    //  3. queue backend update (optional)
    get().queueTradeUpdate(rowId, {
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

    get().recompute({ reason: "trade-delete", tradeIndex });
    get().debouncedSync();
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

  debouncedSync: debounce(async () => {
    const { pendingUpdates, pendingCreates, pendingDeletes, tradesById } =
      get();

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
      await tradeService.sync({
        creates,
        updates,
        deletes,
        tradesById,
      });
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
    } finally {
      set({ isSaving: false });
    }
  }, 800),
});
