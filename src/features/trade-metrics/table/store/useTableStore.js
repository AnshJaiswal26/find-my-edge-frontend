import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { createSelectionSlice } from "./selection.slice";
import { createPopupSlice } from "./popup.slice";
import { createFilterSlice } from "./filter.slice";
import { createSortSlice } from "./sort.slice";
import { createDragSlice } from "./drag.slice";
import { createCoreSlice } from "./core.slice";
import { createComputeSlice } from "./compute.slice";
import { createGroupSlice } from "./group.slice";
import { createRow } from "@table/model";
import { useTradeStore } from "@stores";
import { buildAffectedMap } from "@table/dependency";
import { SCHEMA_SOURCE } from "@lib/analytics/schema";

/* ----------------------------------------------- */
/*                     STORE                       */
/* ----------------------------------------------- */

export const useTableStore = create(
  immer((set, get) => ({
    isDataLoading: false,

    scrollEdge: "left", // "left" | "right"

    setScrollEdge: (dir) => set({ scrollEdge: dir }),

    ...createGroupSlice(set, get),

    ...createSelectionSlice(set, get),

    ...createDragSlice(set, get),

    ...createPopupSlice(set, get),

    ...createFilterSlice(set, get),

    ...createSortSlice(set, get),

    ...createCoreSlice(set, get),

    ...createComputeSlice(set, get),

    hydrateSchema() {
      const { schemasById, schemaOrder } = useTradeStore.getState();

      set({
        columnsById: schemasById,
        columnOrder: schemaOrder,
        affectedMap: buildAffectedMap(schemasById, schemaOrder),
      });
    },

    hydrateFromTrades() {
      const { hydrateSchema, recompute } = get();
      hydrateSchema();

      const {
        tradesById,
        computedById, // 🔥 NEW
        tradeOrder,
        schemasById,
        schemaOrder,
      } = useTradeStore.getState();

      const rowsById = {};
      const rowOrder = [];

      tradeOrder.forEach((tradeId) => {
        const trade = tradesById[tradeId] || {};
        const computed = computedById?.[tradeId] || {}; // 🔥 NEW

        const { row } = createRow(schemasById, tradeId);

        schemaOrder.forEach((schemaId) => {
          const schema = schemasById[schemaId];

          if (!schema) return;

          //  merge logic
          if (schema.source === SCHEMA_SOURCE.COMPUTED) {
            row.cells[schemaId].value = computed[schemaId] ?? null;
          } else {
            row.cells[schemaId].value = trade[schemaId] ?? null;
          }
        });

        rowsById[row.id] = row;
        rowOrder.push(row.id);
      });

      set({ rowsById, rowOrder });

      // 🔥 recompute ensures correctness
      recompute({ reason: "all" });
    },
  })),
);
