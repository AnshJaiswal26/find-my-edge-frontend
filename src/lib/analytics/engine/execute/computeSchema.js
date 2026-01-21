import { computeCumulative } from "./computeCumulative";
import { computeGrouped } from "./computeGrouped";
import { computeRow } from "./computeRow";

const computeMap = {
  row: computeRow,
  cumulative: computeCumulative,
  grouped: computeGrouped,
};

export function computeSchema({
  tradesById,
  tradeOrder,
  schema,
  groups,
  getValue,
  setValue,
}) {
  if (!schema?.type?.includes("computed")) return;
  if (!schema.expression) return;

  if (schema.mode === "grouped" && (!groups || !groups.length)) return;

  const mode = schema.mode ?? "row";
  const runner = computeMap[mode];
  if (!runner) return;

  runner({
    tradesById,
    tradeOrder,
    groups,
    schema,
    getValue,
    setValue,
  });
}
