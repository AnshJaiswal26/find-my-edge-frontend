import { memo, useMemo, useState } from "react";

import { evaluateColorRules, formatForInput } from "@utils";
import { tooltipApi } from "@ui";

import { useTableStore } from "@table/store/useTableStore";
import { formatValue } from "@utils";
import { isColumnEditable } from "@table/dependency";
import { explainFormulaFromColumn } from "./cellUtils";

const handleMouseEnter = (e, type, cell, colId, rowId, color) => {
  if (!type.includes("computed")) return;

  const explanation = explainFormulaFromColumn(colId, rowId);
  if (!explanation) return;

  tooltipApi.show({
    rect: e.target.getBoundingClientRect(),
    content: `= ${explanation?.formula}\n= ${explanation?.expanded}\n= ${explanation?.result}`,
    color,
    slide: -30,
    placement: "top",
  });
};

export const CellDisplay = memo(function CellDisplay({
  cell,
  rowId,
  colId,
  width,
  type,
  display,
  setDraft,
  setEditing,
}) {
  const colorRules = useTableStore((s) => s.columnsById[colId].colorRules);
  const editable = useTableStore((s) => isColumnEditable(colId, s));

  const unselectColumn = useTableStore((s) => s.unselectColumn);

  const color = useMemo(() => {
    const { color, label } = evaluateColorRules(cell.value, colorRules);
    return label === "Default" ? null : color;
  }, [cell.value, colorRules]);

  const displayValue = useMemo(
    () => formatValue(cell.value, type, display),
    [cell.value, type, display],
  );

  return (
    <div
      tabIndex={-1}
      style={{
        width,
        color,
        border: cell.meta?.error ? "1px solid var(--error)" : "",
      }}
      className="relative px-2 py-1 border-1 border-(--border) truncate overflow-hidden focus:border-(--info) h-full"
      onClick={() => {
        unselectColumn({ id: colId });
      }}
      onDoubleClick={() => {
        if (!editable) return;
        setDraft(formatForInput(cell.value ?? "", type));
        setEditing(true);
      }}
      // onMouseEnter={(e) => handleMouseEnter(e, type, cell, colId, rowId, color)}
      onMouseLeave={tooltipApi.hide}
    >
      {displayValue}
    </div>
  );
});
