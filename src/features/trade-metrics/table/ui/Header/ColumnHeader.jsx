import { GripHorizontal } from "lucide-react";
import { useTableStore } from "../../store/useTableStore";
import { bindGlobalPointer } from "../../interaction";

export function ColumnHeader({ colId, index }) {
  const draggingColumn = useTableStore((s) => s.draggingColumn);

  const startColumnDrag = useTableStore((s) => s.startColumnDrag);
  const setColDragOverIndex = useTableStore((s) => s.setColDragOverIndex);
  const endColumnDrag = useTableStore((s) => s.endColumnDrag);
  const updateColumnDrag = useTableStore((s) => s.updateColumnDrag);
  const startColumnResize = useTableStore((s) => s.startColumnResize);

  const selectColumn = useTableStore((s) => s.selectColumn);
  const unselectColumn = useTableStore((s) => s.unselectColumn);

  const column = useTableStore((s) => s.columnsById[colId]);

  const width = useTableStore((s) => s.columnWidths?.[colId] ?? 150);

  const handlePointerDown = (e, mode) => {
    unselectColumn();

    const rect = e.currentTarget
      .closest("[data-col-header]")
      .getBoundingClientRect();

    const start = mode === "drag" ? startColumnDrag : startColumnResize;

    start({
      id: colId,
      index,
      width: rect.width,
      left: rect.left,
      startX: e.clientX,
    });

    bindGlobalPointer("clientX", updateColumnDrag, endColumnDrag);

    e.preventDefault();
  };

  return (
    <div
      data-col-header
      className="group relative select-none"
      style={{ width }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        selectColumn({
          id: colId,
          width: rect.width,
          left: rect.left,
        });
      }}
      onPointerEnter={() => {
        if (draggingColumn) {
          setColDragOverIndex(index);
        }
      }}
    >
      {/* DRAG HANDLE */}
      <div
        onPointerDown={(e) => handlePointerDown(e, "drag")}
        className="opacity-0 group-hover:opacity-60 absolute -bottom-1 left-1/2 -translate-x-1/2 cursor-grab"
      >
        <GripHorizontal size={18} />
      </div>

      <div
        onPointerDown={(e) => handlePointerDown(e, "resize")}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-(--cyan)"
      />

      {/* HEADER BODY */}
      <div className="flex items-center px-2 py-1 border-r border-(--border)">
        {column.label}
      </div>
    </div>
  );
}
