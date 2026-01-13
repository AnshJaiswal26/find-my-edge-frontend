import { filterOperationMap, filterOptions } from "@utils";

export function createGetGroupKey({ rowsById, groupBy }) {
  if (!groupBy) {
    return () => ({
      groupId: "__UNGROUPED__",
      label: "Ungrouped",
    });
  }

  const { key, mode, operation, value, valueTo, group1Name, group2Name } =
    groupBy;

  /* ================= VALUE-BASED GROUPING ================= */
  if (mode === "value") {
    return (rowId) => {
      const v = rowsById[rowId]?.cells[key]?.value;

      const groupId = v == null || v === "" ? "__EMPTY__" : String(v);

      return {
        groupId,
        label: groupId,
      };
    };
  }

  /* ================= CONDITION-BASED GROUPING ================= */
  const opFn = filterOperationMap[operation];

  if (!opFn) {
    throw new Error(`Unknown group operation: ${operation}`);
  }

  const trueLabel =
    group1Name ||
    `${filterOptions[operation]} ${value}${
      valueTo != null ? ` to ${valueTo}` : ""
    }`;

  const falseLabel =
    group2Name ||
    `Not ${filterOptions[operation]} ${value}${
      valueTo != null ? ` to ${valueTo}` : ""
    }`;

  return (rowId) => {
    const v = rowsById[rowId]?.cells[key]?.value;

    if (v == null) {
      return {
        groupId: "__EMPTY__",
        label: "Empty",
      };
    }

    const matched =
      operation === "isBetween" || operation === "isNotBetween"
        ? opFn(v, value, valueTo)
        : opFn(v, value);

    return matched
      ? { groupId: "__MATCH__", label: trueLabel }
      : { groupId: "__NO_MATCH__", label: falseLabel };
  };
}
