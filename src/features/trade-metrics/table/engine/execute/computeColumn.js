import { computeCumulative } from "./computeCumulative";
import { computeGrouped } from "./computeGrouped";
import { computeRow } from "./computeRow";

const computeMap = {
  row: computeRow,
  cumulative: computeCumulative,
  grouped: computeGrouped,
};

export function computeColumn(rowsById, rowOrder, column) {
  if (!column.type.includes("computed") || !column.expression) return;

  computeMap[column.mode ?? "row"](
    rowOrder.map((id) => rowsById[id]),
    column
  );
}
