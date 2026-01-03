import { computePartialCumulative } from "./computePartialCumulative";
import { computePartialGrouped } from "./computePartialGrouped";
import { evaluateExpression } from "./evaluateExpression";

export const PARTIAL_RUNNERS = {
  row: (rowsById, rowOrder, i, col) => {
    const row = rowsById[rowOrder[i]];
    row.cells[col.id].value = evaluateExpression(col.expression, row, {});
  },
  cumulative: computePartialCumulative,
  grouped: computePartialGrouped,
};
