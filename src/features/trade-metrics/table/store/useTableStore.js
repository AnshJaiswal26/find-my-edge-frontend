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
import { parseInputValue } from "@utils";
import { useTradeStore } from "@stores";
import { buildAffectedMap } from "@table/dependency";

/* ----------------------------------------------- */
/*                     STORE                       */
/* ----------------------------------------------- */

export const useTableStore = create(
  immer((set, get) => ({
    isDataLoading: false,

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
        affectedMap: buildAffectedMap(schemasById),
      });
    },

    hydrateRows() {
      const { tradesById, tradeOrder, schemasById } = useTradeStore.getState();

      const rowsById = {};
      const rowOrder = [];

      tradeOrder.forEach((tradeId) => {
        const trade = tradesById[tradeId];
        const row = createRow(schemasById, tradeId);

        row.cells.date.value = parseInputValue(trade.date, "date");
        row.cells.entryTime.value = parseInputValue(trade.entryTime, "time");
        row.cells.exitTime.value = parseInputValue(trade.exitTime, "time");
        row.cells.duration.value = parseInputValue(trade.duration, "duration");
        row.cells.symbol.value = parseInputValue(trade.symbol, "text");
        row.cells.entry.value = parseInputValue(trade.entry, "number");
        row.cells.exit.value = parseInputValue(trade.exit, "number");
        row.cells.qty.value = parseInputValue(trade.qty, "number");

        rowsById[row.id] = row;
        rowOrder.push(row.id);
      });

      set({ rowsById, rowOrder });

      get().recompute({ reason: "all" });
    },
  })),
);
