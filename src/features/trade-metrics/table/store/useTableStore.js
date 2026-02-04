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

      const { tradesById, tradeOrder, schemasById, schemaOrder } =
        useTradeStore.getState();

      const rowsById = {};
      const rowOrder = [];

      tradeOrder.forEach((tradeId) => {
        const trade = tradesById[tradeId];
        const { row } = createRow(schemasById, tradeId);

        schemaOrder.forEach((schemaId) => {
          row.cells[schemaId].value = trade[schemaId];
        });

        rowsById[row.id] = row;
        rowOrder.push(row.id);
      });

      set({ rowsById, rowOrder });

      recompute({ reason: "all" });
    },
  })),
);
