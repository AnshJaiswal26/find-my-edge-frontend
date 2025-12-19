// components/ColumnHeader.jsx
import { useRef } from "react";
import { useTableStore } from "./store";

export function ColumnHeader({ column, index }) {
  const ref = useRef(null);

  const { reorderColumn, resizeColumn, columnWidths } = useTableStore();

  /* ---------- Drag reorder ---------- */
  function onDragStart(e) {
    e.dataTransfer.setData("colIndex", index);
  }

  function onDrop(e) {
    const from = Number(e.dataTransfer.getData("colIndex"));
    reorderColumn(from, index);
  }

  /* ---------- Resize ---------- */
  function startResize(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[column.id] || ref.current.offsetWidth;

    function onMove(ev) {
      resizeColumn(column.id, startWidth + ev.clientX - startX);
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  return (
    <div
      ref={ref}
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="relative flex items-center px-2 py-1 border-r border-(--border) bg-(--surface-muted) font-medium select-none"
      style={{ width: columnWidths[column.id] ?? 200 }}
    >
      {column.label}

      {/* Resize handle */}
      <div
        onMouseDown={startResize}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
      />
    </div>
  );
}
