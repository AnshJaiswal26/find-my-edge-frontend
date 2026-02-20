import { formatForInput } from "@utils";
import { debounce } from "lodash";
import { useUIStore } from "@stores";
import { createRow } from "@table/model";
import { tradeApi } from "@lib/api/trade.api";

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
    const {
      pendingUpdates,
      pendingCreates,
      pendingDeletes,
      tradesById,
      schemasById,
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

      // 🔹 CREATE
      await Promise.all(
        Object.values(creates).map((trade) => tradeApi.create(trade)),
      );

      // 🔹 UPDATE
      await Promise.all(
        Object.keys(updates).map((id) => {
          const trade = tradesById[id];
          const cleanTrade = {};

          Object.keys(trade).forEach((key) => {
            if (key === "id") return;
            const schema = schemasById[key];
            cleanTrade[key] = formatForInput(trade[key], schema.semanticType);
          });

          return tradeApi.update(id, cleanTrade);
        }),
      );

      // 🔹 DELETE
      await Promise.all(Array.from(deletes).map((id) => tradeApi.delete(id)));
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
    } finally {
      set({ isSaving: false });
    }
  }, 800),
});
