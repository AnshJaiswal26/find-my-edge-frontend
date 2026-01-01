import { evaluateCummulative, usesPrev } from "./evaluateCummulative";
import { evaluateExpression } from "./evaluateExpression";

export function evaluateRows(
  row,
  changedColId,
  columnsById,
  affectedMap,
  rowsById,
  rowOrder
) {
  const queue = [changedColId];
  const visited = new Set();

  while (queue.length) {
    const colId = queue.shift();
    affectedMap[colId]?.forEach((nextColId) => {
      if (visited.has(nextColId)) return;
      visited.add(nextColId);

      const column = columnsById[nextColId];

      if (usesPrev(column.expression)) {
        evaluateCummulative(rowsById, rowOrder, column);
      } else {
        const value = evaluateExpression(column.expression, row);
        row.cells[nextColId].value = value;
      }

      queue.push(nextColId);
    });
  }
}
