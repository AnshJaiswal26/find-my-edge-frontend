import { memo, useMemo } from "react";

import { evaluateColorRules, formatForInput } from "@shared/utils";

import { useTableStore } from "@features/trade-metrics/table/store";
import { formatValue } from "@shared/utils";
import { explainFormulaFromColumn } from "./cellUtils";
import { useTradeStore } from "@shared/stores";
import { SchemaSource } from "@lib/analytics/schema";

// const handleMouseEnter = (e, type, cell, colId, rowId, color) => {
//   if (!type.includes("computed")) return;

//   const explanation = explainFormulaFromColumn(colId, rowId);
//   if (!explanation) return;

//   tooltipApi.show({
//     rect: e.target.getBoundingClientRect(),
//     content: `= ${explanation?.formula}\n= ${explanation?.expanded}\n= ${explanation?.result}`,
//     color,
//     slide: -30,
//     placement: "top",
//   });
// };

export const CellDisplay = memo(function CellDisplay({
  value,
  rowId,
  colId,
  width,
  type,
  display,
  setDraft,
  setEditing,
}) {
  const colorRules = useTradeStore((s) => s.schemasById[colId].colorRules);
  const isColEditable = useTradeStore(
    (s) => s.schemasById[colId].source !== SchemaSource.COMPUTED,
  );

  const isColUnlocked = useTableStore(
    (s) => s.lockedColumnsMap?.[colId] !== true,
  );

  const editable = isColUnlocked && isColEditable;

  const unselectColumn = useTableStore((s) => s.unselectColumn);

  const color = useMemo(() => {
    const { color, label } = evaluateColorRules(value, colorRules);
    return label === "Default" ? null : color;
  }, [value, colorRules]);

  const displayValue = useMemo(
    () => formatValue(value, type, display),
    [value, type, display],
  );

  return (
    <div
      tabIndex={-1}
      style={{ width, color }}
      className="relative px-2 py-1 border-1 border-(--border) truncate overflow-hidden focus:border-(--info) h-full"
      onClick={() => {
        unselectColumn({ id: colId });
      }}
      onDoubleClick={() => {
        if (!editable) return;
        setDraft(formatForInput(value ?? "", type));
        setEditing(true);
      }}
      // onMouseEnter={(e) => handleMouseEnter(e, type, cell, colId, rowId, color)}
      // onMouseLeave={tooltipApi.hide}
    >
      {displayValue}
    </div>
  );
});
