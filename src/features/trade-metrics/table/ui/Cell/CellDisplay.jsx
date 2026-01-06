import { memo, useMemo, useState } from "react";
import { useTableStore } from "../../store/useTableStore";
import { explainFormulaFromColumn } from "./cellUtils";
import { evaluateColorRules, formatValue } from "../../utils";
import { tooltipApi } from "@ui";

const handleMouseEnter = (e, type, cell, colId, rowId, color) => {
  if (type !== "computed") return;

  const explanation = explainFormulaFromColumn(colId, rowId);

  tooltipApi.show({
    rect: e.target.getBoundingClientRect(),
    content: `= ${explanation.formula}\n= ${explanation.expanded}\n= ${cell.value}`,
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
  setDraft,
  setEditing,
}) {
  const colorRules = useTableStore((s) => s.columnsById[colId].colorRules);
  const display = useTableStore((s) => s.columnsById[colId].display);
  const editable = useTableStore(
    (s) => s.columnsById[colId].editable !== false && type !== "computed"
  );

  const unselectColumn = useTableStore((s) => s.unselectColumn);

  const [selected, setSelected] = useState(false);

  const color = useMemo(
    () => evaluateColorRules(cell.value, colorRules),
    [cell.value, colorRules]
  );

  const displayValue = useMemo(
    () => formatValue(cell.value, type, display),
    [cell.value, type, display]
  );

  return (
    <div
      tabIndex={0}
      style={{ width, color }}
      className="relative px-2 py-1 border-r border-(--border) truncate overflow-hidden"
      onClick={() => {
        setSelected(true);
        unselectColumn({ id: colId });
      }}
      onBlur={() => setSelected(false)}
      onDoubleClick={() => {
        if (!editable) return;
        setDraft(cell.value ?? "");
        setEditing(true);
      }}
      onMouseEnter={(e) => handleMouseEnter(e, type, cell, colId, rowId, color)}
      onMouseLeave={tooltipApi.hide}
    >
      {displayValue}
      {selected && (
        <div className="absolute inset-0 border border-(--info) bg-(--info-soft)" />
      )}
    </div>
  );
});
