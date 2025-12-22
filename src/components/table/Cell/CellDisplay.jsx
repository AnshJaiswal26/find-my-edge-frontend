import { useTableStore } from "../store";
import { formatValue, TONE_CLASS } from "../tableUtils";

export const CellDisplay = ({ row, column, width, setDraft, setEditing }) => {
  const unselectColumn = useTableStore((s) => s.unselectColumn);

  const editable = column.type !== "computed" && column.editable !== false;

  const cell = row.cells[column.id];

  const tone = column.conditionalStyle?.(cell.value) ?? "neutral";

  return (
    <div
      onClick={() => unselectColumn({ id: column.id })}
      style={{ width }}
      className={`px-2 py-1 cursor-pointer border-r-1 border-r-(--border) ${TONE_CLASS[tone]}`}
      onDoubleClick={() => {
        if (!editable) return;
        setDraft(cell.value ?? "");
        setEditing(true);
      }}
      title={cell.meta?.error}
    >
      {formatValue(cell.value, column)}
    </div>
  );
};
