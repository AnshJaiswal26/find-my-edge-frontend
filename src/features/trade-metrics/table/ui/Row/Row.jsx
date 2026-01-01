import { GripVertical } from "lucide-react";
import { useTableStore } from "../../store/useTableStore";
import { Cell } from "../Cell/Cell";
import { useRef } from "react";
import { bindGlobalPointer } from "../../interaction";

export function Row({ rowId, index }) {
  const rowRef = useRef(null);

  const columnOrder = useTableStore((s) => s.columnOrder);
  const draggingRow = useTableStore((s) => s.draggingRow);

  const {
    startRowDrag,
    updateRowDrag,
    endRowDrag,
    setRowDragOverIndex,
    unselectColumn,
    updateCell,
  } = useTableStore.getState();

  return (
    <div
      ref={rowRef}
      className="flex border-b border-(--border) bg-(--surface)"
      onPointerEnter={() => {
        if (draggingRow) {
          setRowDragOverIndex(index);
        }
      }}
    >
      {/* ROW HANDLE */}
      <div
        onPointerDown={(e) => {
          if (!rowRef.current) return;

          unselectColumn();

          const rect = rowRef.current.getBoundingClientRect();

          startRowDrag({
            id: rowId,
            index,
            top: rect.top,
            height: rect.height,
            startY: e.clientY,
          });

          bindGlobalPointer("clientY", updateRowDrag, endRowDrag);

          e.preventDefault();
        }}
        className="
          sticky left-0 w-12 shrink-0
          flex items-center justify-center
          border-r border-(--border)
          cursor-grab active:cursor-grabbing
          bg-(--surface-muted)
          group z-2
        "
      >
        <GripVertical
          size={14}
          className="opacity-0 absolute right-1 group-hover:opacity-60"
        />
        {index + 1}
      </div>

      {/* ROW CELLS */}
      <div className="flex">
        {columnOrder.map((colId) => (
          <Cell
            key={colId}
            colId={colId}
            rowId={rowId}
            onCommit={(input, colId) => {
              updateCell(rowId, colId, input);
            }}
          />
        ))}
      </div>
    </div>
  );
}
