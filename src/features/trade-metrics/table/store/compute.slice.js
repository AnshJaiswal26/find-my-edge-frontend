import { useTradeStore } from "@stores";
import { collectAffectedColumns } from "../dependency";
import {
  COMPUTATION_MODE,
  computeOverSequence,
} from "@lib/analytics/engine/execute";
import { SCHEMA_SOURCE } from "@lib/analytics/schema";

function syncRowsToTradeStore(rowsById, changedRowIds, columnsById) {
  if (!changedRowIds.size) return;

  useTradeStore.setState((state) => {
    changedRowIds.forEach((id) => {
      const row = rowsById[id];

      const raw = {};
      const computed = {};

      Object.entries(row.cells).forEach(([colId, cell]) => {
        const schema = columnsById[colId];

        if (!schema) return;

        if (schema.source === SCHEMA_SOURCE.COMPUTED) {
          // 🔥 computed goes here
          computed[colId] = cell.value;
        } else {
          // ✅ raw goes here
          raw[colId] = cell.value;
        }
      });

      state.tradesById[id] = { id, ...raw };
      state.computedById[id] = computed;
    });
  });
}

export const createComputeSlice = (set, get) => ({
  /* ------------------------------------------------------- */
  /*              CELL AND RECOMPUTE ACTIONS                 */
  /* ------------------------------------------------------- */

  updateCell(rowId, colId, value, groupId) {
    const state = get();
    const cell = state.rowsById[rowId].cells[colId];
    const column = state.columnsById[colId];

    if (cell.value === value) return;

    set((s) => {
      s.rowsById[rowId].cells[colId].value = value;
    });

    if (state.affectedMap?.[column.id]) {
      state.recompute({
        reason: "cell",
        rowId,
        colId,
        groupId,
      });
    }

    useTradeStore.getState().updateTrade(rowId, {
      [colId]: value,
    });

    useTradeStore.getState().queueTradeUpdate(rowId, {
      [colId]: value,
    });
  },

  recompute(payload) {
    const changedRowIds = new Set();

    set((state) => {
      const {
        rowsById: tradesById,
        rowOrder,
        columnsById,
        columnOrder,
        affectedMap,
        groupBy,
        groups,
        filteredRowOrder,
        sortedRowOrder,
      } = state;

      /* ================================
       * Helpers
       * ================================ */
      const getValue = (trade, key) => trade.cells[key]?.value ?? null;

      const setValue = (trade, schema, value) => {
        const cell = trade.cells[schema.id];

        if (cell.value === value) return; // no real change

        cell.value = value;
        changedRowIds.add(trade.id); // 🔥 track row that changed
      };

      const compute = ({ sequenceIds, schema, startIndex = 0, mode }) => {
        computeOverSequence({
          schema,
          getTradeAt: (index) => {
            if (index < 0) return null;
            const id = sequenceIds[index];
            return id ? tradesById[id] : null;
          },
          getTradeCount: () => sequenceIds.length,
          getSchemaType: (key) => {
            const col = columnsById[key];
            return { format: col?.display?.format, type: col.semanticType };
          },
          getValue,
          setValue,
          startIndex,
          mode,
        });
      };

      const isComputed = (schema) => schema?.source === SCHEMA_SOURCE.COMPUTED;

      /* ================================
       * FULL RECOMPUTE
       * ================================ */
      if (!payload || payload.reason === "all") {
        columnOrder.forEach((id) => {
          const schema = columnsById[id];

          if (!isComputed(schema)) return;

          // Grouped
          if (schema.mode === "grouped" && groups) {
            groups.forEach((group) =>
              compute({
                schema,
                sequenceIds: group.tradeIds,
                mode: COMPUTATION_MODE.WINDOW,
              }),
            );
            return;
          }

          // Normal / cumulative
          compute({
            schema,
            sequenceIds: rowOrder,
            mode:
              schema.mode !== "row"
                ? COMPUTATION_MODE.WINDOW
                : COMPUTATION_MODE.BASE,
          });
        });
      } else if (payload.reason === "row-delete") {
        columnOrder.forEach((id) => {
          const col = columnsById[id];
          if (!col || col?.mode !== "cumulative") return;

          compute({
            schema: col,
            sequenceIds: rowOrder,
            startIndex: Math.max(payload.rowIndex - 1, 0),
            mode: COMPUTATION_MODE.WINDOW,
          });
        });
      } else if (payload.reason === "grouping") {
        const effectiveOrder = sortedRowOrder.length
          ? sortedRowOrder
          : filteredRowOrder.length
            ? filteredRowOrder
            : rowOrder;

        columnOrder.forEach((id) => {
          const col = columnsById[id];

          if (!col || col?.mode !== "grouped") return;

          if (groups) {
            groups.forEach((group) =>
              compute({
                schema: col,
                sequenceIds: group.tradeIds,
                mode: COMPUTATION_MODE.WINDOW,
              }),
            );
            return;
          }
          compute({
            schema: col,
            sequenceIds: effectiveOrder,
            mode: COMPUTATION_MODE.WINDOW,
          });
        });
      } else if (payload.reason === "cell") {
        /* ================================
         * CELL CHANGE (PARTIAL)
         * ================================ */
        const { rowId, colId } = payload;

        const affectedSchemas = collectAffectedColumns(colId, affectedMap);

        affectedSchemas.forEach((schemaId) => {
          const schema = columnsById[schemaId];
          if (!isComputed(schema)) return;

          // Grouped
          if (schema.mode === "grouped" && groupBy && groups) {
            const group = groups.find((g) => g.tradeIds.includes(rowId));
            if (!group) return;

            compute({
              schema,
              sequenceIds: group.tradeIds,
              startIndex: group.tradeIds.indexOf(rowId),
              mode: COMPUTATION_MODE.WINDOW,
            });

            return;
          }

          // Row-only
          if (schema.mode === "row") {
            compute({
              schema,
              sequenceIds: [rowId],
              mode: COMPUTATION_MODE.BASE,
            });
            return;
          }

          const changedIndex = rowOrder.indexOf(rowId);
          if (changedIndex === -1) return;

          // Cumulative
          compute({
            schema,
            sequenceIds: rowOrder,
            startIndex: changedIndex,
            mode: COMPUTATION_MODE.WINDOW,
          });
        });
      } else if (payload.reason === "column" && payload.colId) {
        /* ================================
         * COLUMN CHANGE
         * ================================ */
        const schema = columnsById[payload.colId];
        if (!isComputed(schema)) return;

        // Grouped
        if (schema.mode === "grouped" && groups) {
          groups.forEach((group) =>
            compute({
              schema,
              sequenceIds: group.tradeIds,
              mode: COMPUTATION_MODE.WINDOW,
            }),
          );
          return;
        }
        // Normal
        compute({
          schema,
          sequenceIds: rowOrder,
          mode:
            schema.mode !== "row"
              ? COMPUTATION_MODE.WINDOW
              : COMPUTATION_MODE.BASE,
        });
      }
      syncRowsToTradeStore(tradesById, changedRowIds, columnsById);
    });
  },
});
