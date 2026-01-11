import { filterOperationMap } from "@utils";

export function createGetGroupKey({ rowsById, groupBy }) {
  if (!groupBy) return () => "Ungrouped";

  const { key, mode, operation, value, valueTo } = groupBy;

  // 🔹 value-based grouping
  if (mode === "value") {
    return (rowId) => rowsById[rowId]?.cells[key]?.value ?? "__EMPTY__";
  }

  // 🔹 condition-based grouping
  const opFn = filterOperationMap[operation];

  return (rowId) => {
    const v = rowsById[rowId]?.cells[key]?.value;

    if (v == null) return "__EMPTY__";

    const matched =
      operation === "isBetween" || operation === "isNotBetween"
        ? opFn(v, value, valueTo)
        : opFn(v, value);

    return matched ? "MATCHED" : "NOT_MATCHED";
  };
}
