import { useTableStore } from "../store";
import { TONE_CLASS } from "../tableUtils";

export const CellDisplay = ({ cell, colId, width, setDraft, setEditing }) => {
  const column = useTableStore((s) => s.columnsById[colId]);

  const { unselectColumn, selectCell } = useTableStore.getState();

  const editable = column.type !== "computed" && column.editable !== false;

  const tone = column.conditionalStyle?.(cell.value) ?? "neutral";

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
      style={{ width }}
      className={`px-2 py-1 cursor-pointer border-r-1 border-r-(--border) ${TONE_CLASS[tone]}`}
      onDoubleClick={() => {
        if (!editable) return;
        setDraft(cell.value ?? "");
        setEditing(true);
      }}
      title={cell.meta?.error}
    >
      {cell.display}
    </div>
  );
};
