import { useMemo, useState } from "react";
import { useTableStore } from "../../store/useTableStore";
import { useUIStore } from "@stores";
import { explainFormulaFromColumn } from "./cellUtils";
import { evaluateColorRules, formatValue } from "../../utils";
import { tooltipApi } from "@ui";

export const CellDisplay = ({
  cell,
  colId,
  rowId,
  width,
  setDraft,
  setEditing,
}) => {
  const column = useTableStore((s) => s.columnsById[colId]);

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
        border-r-1 border-r-(--border) !z-1 flex-none truncate
      "
      onClick={(e) => {
        setSelect(true);
        unselectColumn({ id: colId });
      }}
      onBlur={() => setSelect(false)}
      onMouseEnter={(e) => {
        if (!explanation) return;
        setTimeout(
          () =>
            tooltipApi.show({
              rect: e.target.getBoundingClientRect(),
              content: content,
              placement: "top",
            }),
          100
        );
      }}
      onMouseLeave={() => tooltipApi.hide()}
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
