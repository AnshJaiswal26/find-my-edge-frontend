import { useMemo } from "react";
import { useTableStore } from "../store";
import { evaluateColorRules, formatValue } from "../tableUtils";

export const CellDisplay = ({ cell, colId, width, setDraft, setEditing }) => {
  const column = useTableStore((s) => s.columnsById[colId]);

  const { unselectColumn, selectCell } = useTableStore.getState();

  const editable = column.type !== "computed" && column.editable !== false;

  const color = useMemo(
    () => evaluateColorRules(cell.value, column?.colorRules),
    [(cell.value, column?.colorRules)]
  );

  const displayValue = useMemo(
    () => formatValue(cell.value, column),
    [cell.value, column]
  );
  console.log("render///");

  return (
    <div
      tabIndex={0}
      onClick={(e) => {
        const rect = e.target.getBoundingClientRect();
        selectCell({
          top: rect.top,
          left: rect.left,
          height: rect.height,
          width: rect.width,
        });
        unselectColumn({ id: colId });
      }}
      style={{ width, color }}
      className={`px-2 py-1 cursor-pointer border-r-1 border-r-(--border)`}
      onDoubleClick={() => {
        if (!editable) return;
        setDraft(cell.value ?? "");
        setEditing(true);
      }}
      title={cell.meta?.error}
    >
      {displayValue}
    </div>
  );
};
