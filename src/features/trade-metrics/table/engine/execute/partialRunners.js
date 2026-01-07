import { computePartialCumulative } from "./computePartialCumulative";
import { computePartialGrouped } from "./computePartialGrouped";
import { evaluateExpression } from "./evaluateExpression";

export const PARTIAL_RUNNERS = {
  row: (rowsById, rowOrder, i, col) => {
    const row = rowsById[rowOrder[i]];
    const res = evaluateExpression(col.expression, row, {});
    row.cells[col.id].value = res ? res.value : null;
  },
  cumulative: computePartialCumulative,
  grouped: computePartialGrouped,
};
