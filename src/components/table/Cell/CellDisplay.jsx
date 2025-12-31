import { useMemo, useState } from "react";
import { useTableStore } from "../store";
import { evaluateColorRules, formatValue } from "../tableUtils";
import { useUIStore } from "@stores";
import { explainFormulaFromColumn } from "./cellUtils";

export const CellDisplay = ({
  cell,
  colId,
  rowId,
  width,
  setDraft,
  setEditing,
}) => {
  const column = useTableStore((s) => s.columnsById[colId]);

  const showTooltip = useUIStore((s) => s.showTooltip);

  const { unselectColumn } = useTableStore.getState();

  const [select, setSelect] = useState(false);

  const editable = column.type !== "computed" && column.editable !== false;

  const color = useMemo(
    () => evaluateColorRules(cell.value, column?.colorRules),
    [cell.value, column?.colorRules]
  );

  const displayValue = useMemo(
    () => formatValue(cell.value, column),
    [cell.value, column]
  );

  const explanation = useMemo(() => {
    if (column.type !== "computed") return null;
    return explainFormulaFromColumn(column, rowId);
  }, [column, cell.value]);

  const content = explanation
    ? [
        `= ${explanation.formula}`,
        `= ${explanation.expanded}`,
        `= ${cell.value || 0}`,
      ].join("\n")
    : null;

  return (
    <div
      tabIndex={0}
      style={{ width, color }}
      className="
        relative px-2 py-1 cursor-pointer
        border-r-1 border-r-(--border) !z-1
      "
      onClick={(e) => {
        setSelect(true);
        unselectColumn({ id: colId });
      }}
      onBlur={() => setSelect(false)}
      onMouseEnter={(e) => {
        if (!explanation) return null;
        showTooltip({
          color,
          visible: true,
          content,
          rect: e.target.getBoundingClientRect(),
          placement: "",
        });
      }}
      onMouseLeave={() => {
        showTooltip({
          visible: false,
          content: null,
          rect: null,
          placement: "",
        });
      }}
      onDoubleClick={() => {
        if (!editable) return;
        setDraft(cell.value ?? "");
        setEditing(true);
      }}
      title={cell.meta?.error}
    >
      {displayValue}
      {select && (
        <div className="absolute border w-full h-full top-0 left-0 border-(--info) bg-(--info-soft)" />
      )}
    </div>
  );
};
