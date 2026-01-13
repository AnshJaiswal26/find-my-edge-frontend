import { computeCumulative } from "./computeCumulative";
import { computeGrouped } from "./computeGrouped";
import { computeRow } from "./computeRow";

const computeMap = {
  row: ({ rowsById, rowOrder, column }) => {
    computeRow(rowsById, rowOrder, column);
  },

  cumulative: ({ rowsById, rowOrder, column }) => {
    computeCumulative(rowsById, rowOrder, column);
  },

  grouped: ({ rowsById, groups, column }) => {
    computeGrouped(rowsById, groups, column);
  },
};

export function computeColumn(rowsById, rowOrder, column, groups) {
  if (!column.type.includes("computed")) return;
  if (!column.expression) return;
  if (column.mode === "grouped" && !groups) return;

  const mode = column.mode ?? "row";
  const runner = computeMap[mode];

  if (!runner) return;

  runner({
    rowsById,
    rowOrder,
    groups,
    column,
  });
}
