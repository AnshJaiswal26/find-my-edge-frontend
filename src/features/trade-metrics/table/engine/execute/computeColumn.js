import { computeCumulative } from "./computeCumulative";
import { computeGrouped } from "./computeGrouped";
import { computeRow } from "./computeRow";

export function computeColumn(rowsById, rowOrder, column, columnsById) {
  if (column.type !== "computed" || !column.expression) return;

  switch (column.mode ?? "row") {
    case "row":
      computeRow(
        rowOrder.map((id) => rowsById[id]),
        column,
        columnsById
      );
      break;

    case "cumulative":
      computeCumulative(
        rowOrder.map((id) => rowsById[id]),
        column,
        columnsById
      );
      break;

    case "grouped":
      computeGrouped(
        rowOrder.map((id) => rowsById[id]),
        column,
        columnsById
      );
      break;
  }
}
