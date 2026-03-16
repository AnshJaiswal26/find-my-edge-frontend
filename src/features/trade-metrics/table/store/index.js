import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { createFilterSlice } from "./filter.slice";
import { createSortSlice } from "./sort.slice";
import { createUiSlice } from "./ui.slice";
import { createCoreSlice } from "./core.slice";
import { createComputeSlice } from "./compute.slice";
import { createGroupSlice } from "./group.slice";
import { useTradeStore } from "@shared/stores";

import { getLockedColumnsMap } from "@features/trade-metrics/table/view";
import { tradeMetricService } from "@features/trade-metrics/table/service/tradeMetric.service";

/* ----------------------------------------------- */
/*                     STORE                       */
/* ----------------------------------------------- */

export const useTableStore = create(
  immer((set, get) => ({
    columnsById: {},
    columnsOrder: [],
    columnWidths: {},
    lockedColumnsMap: {},
    highlightedRows: {},

    loading: {
      createSchema: false,
      deleteSchema: false,
    },

    isInitializing: false,
    isInitialized: false,

    isSavingLayout: false,

    ...createGroupSlice(set, get),

    ...createUiSlice(set, get),

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

    initTradeMetricTable: async () => {
      const { isInitialized } = get();
      if (isInitialized) return;

      try {
        set({ isInitializing: true });

        const res = await tradeMetricService.init();

        console.log("Init response", res);
        const data = res.data || res;

        set({
          columnsOrder: data.columnsOrder || [],
          columnWidths: data.columnWidths || {},
          highlightedRows: data.highlightedRows || {},
          isInitialized: true,
        });
      } catch (err) {
        console.error("Failed to initialize table page", err);
      } finally {
        set({ isInitializing: false });
      }
    },
  })),
);
