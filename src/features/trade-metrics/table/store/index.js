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
import { useTradeStore } from "@shared/stores";

import { getLockedColumnsMap } from "@features/trade-metrics/table/view";

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

    updateLockedColumns: () => {
      const tableState = get();
      const { schemasById } = useTradeStore.getState();

      set((state) => {
        state.lockedColumnsMap = getLockedColumnsMap(tableState, schemasById);
      });
    },

    hydrateSchema() {
      const { schemasOrder } = useTradeStore.getState();

      set({
        columnsOrder: schemasOrder,
      });
    },
  })),
);
