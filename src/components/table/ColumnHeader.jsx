import { GripHorizontal } from "lucide-react";
import { useTableStore } from "./store";

function bindGlobalPointer(onMove, onUp) {
  function move(e) {
    onMove(e.clientX);
  }
  function up() {
    onUp();
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  }
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

export function ColumnHeader({ colId, index }) {
  const draggingColumn = useTableStore((s) => s.draggingColumn);
  const startColumnDrag = useTableStore((s) => s.startColumnDrag);
  const setDragOverIndex = useTableStore((s) => s.setDragOverIndex);
  const endColumnDrag = useTableStore((s) => s.endColumnDrag);
  const updateColumnDrag = useTableStore((s) => s.updateColumnDrag);
  const startColumnResize = useTableStore((s) => s.startColumnResize);

  const column = useTableStore((s) => s.columnsById[colId]);
  const width = useTableStore((s) => s.columnWidths?.[colId] ?? 200);

  return (
    <div
      data-col-header
      className="group relative select-none"
      style={{ width }}
      onPointerEnter={() => {
        if (draggingColumn) {
          setDragOverIndex(index);
        }
      }}
    >
      {/* DRAG HANDLE */}
      <div
        onPointerDown={(e) => {
          const rect = e.currentTarget
            .closest("[data-col-header]")
            .getBoundingClientRect();

          startColumnDrag({
            id: colId,
            index,
            width: rect.width,
            left: rect.left,
            top: rect.top,
            height: rect.height,
            startX: e.clientX,
          });

          bindGlobalPointer(updateColumnDrag, endColumnDrag);

          e.preventDefault();
        }}
        className="opacity-0 group-hover:opacity-60 absolute -bottom-1 left-1/2 -translate-x-1/2 cursor-grab"
      >
        <GripHorizontal size={18} />
      </div>

      <div
        onPointerDown={(e) => {
          const rect = e.currentTarget
            .closest("[data-col-header]")
            .getBoundingClientRect();

          startColumnResize({
            id: colId,
            width: rect.width,
            left: rect.left,
            top: rect.top,
            height: rect.height,
            startX: e.clientX,
          });

          bindGlobalPointer(updateColumnDrag, endColumnDrag);
          e.stopPropagation();
        }}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
      />

      {/* HEADER BODY */}
      <div className="flex items-center px-2 py-1 border-r border-(--border) bg-(--surface-muted)">
        {column.label}
      </div>
    </div>
  );
}
