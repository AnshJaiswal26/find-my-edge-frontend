import { FILTER_OPERATION_MAP, FILTER_OPTIONS } from "@utils";
import { getDateBucket } from "./getDateBucket";

function compileGroupSpec(spec) {
  switch (spec.type) {
    case "field":
      return (row) => row[spec.field];

    case "date":
      return (row) => formatDate(row[spec.field], spec.unit);

    case "timeRange":
      return (row) => matchTimeRange(row[spec.field], spec.ranges);

    case "valueRange":
      return (row) => matchValueRange(row[spec.field], spec.ranges);

    case "condition":
      return (row) => matchCondition(row, spec.cases);

    case "expression":
      return (row) => evaluateExpression(spec.expr, { row });

    case "composite": {
      const fns = spec.specs.map(compileGroupSpec);
      return (row) => fns.map((fn) => fn(row)).join(" / ");
    }
  }
}

export function createGetGroupKey({ rowsById, groupSpec }) {
  const getKey = compileGroupSpec(groupSpec);

  return (rowId) => {
    const row = rowsById[rowId];

    if (!row) {
      return { groupId: "__INVALID__", label: "Invalid" };
    }

    const key = getKey(row);

    return {
      groupId: key ?? "__EMPTY__",
      label: key ?? "Empty",
    };
  };
}
