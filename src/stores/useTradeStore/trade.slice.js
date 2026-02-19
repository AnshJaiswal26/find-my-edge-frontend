import { formatForInput } from "@utils";
import { debounce } from "lodash";
import { useUIStore } from "@stores";
import { createRow } from "@table/model";
import { tradeApi } from "@lib/api/trade.api";

export const createTradeSlice = (set, get) => ({
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
    const { row, trade } = createRow(get().schemasById, id);

    set((s) => {
      s.tradesById[id] = { id, ...trade };
      s.tradeOrder.push(id);
    });
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
      s.tradeOrder = s.tradeOrder.filter((id, i) => {
        if (id === tradeId) tradeIndex = i;
        return id !== tradeId;
      });
    });

    get().recompute({ reason: "trade-delete", tradeIndex });
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
    const { pendingUpdates, tradesById, schemasById } = get();

    if (!Object.keys(pendingUpdates).length) return;

    set({ isSaving: true });

    try {
      const updates = { ...pendingUpdates };

      // clear queue optimistically
      set({ pendingUpdates: {} });

      await Promise.all(
        Object.keys(updates).map((id) => {
          const trade = tradesById[id];

          // filter ONLY non-computed fields
          const cleanTrade = {};

          Object.keys(trade).forEach((key) => {
            if (key === "id") return;

            const schema = schemasById[key];

            cleanTrade[key] = formatForInput(trade[key], schema.semanticType);
          });

          return tradeApi.update(id, cleanTrade); // full object
        }),
      );
    } catch (err) {
      useUIStore.getState().showToast("ERROR", err.message);
    } finally {
      set({ isSaving: false });
    }
  }, 800),
});
