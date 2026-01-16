import { computePartialCumulative } from "./computePartialCumulative";
import { computePartialGrouped } from "./computePartialGrouped";
import { evaluateExpression } from "@lib/expression";

export const PARTIAL_RUNNERS = {
  row: ({ rowsById, rowId, column }) => {
    const row = rowsById[rowId];
    const value = evaluateExpression(column.expression, {
      getValue: (key) => row.cells[key]?.value ?? null,
    });
    row.cells[column.id].value = value;
  },

  cumulative: ({ rowsById, rowOrder, rowIndex, column }) => {
    computePartialCumulative(rowsById, rowOrder, rowIndex, column);
  },

  grouped: ({ rowsById, group, groupIndex, column }) => {
    computePartialGrouped(rowsById, group, groupIndex, column);
  },
};
