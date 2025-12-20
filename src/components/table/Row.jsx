// components/Row.jsx
import { useTableStore } from "./store";
import { Cell } from "./Cell";
import { GripVertical } from "lucide-react";

export function Row({ rowId, index }) {
  const reorderRow = useTableStore((s) => s.reorderRow);
  const columnOrder = useTableStore((s) => s.columnOrder);
  const updateCell = useTableStore((s) => s.updateCell);

  function onDragStart(e) {
    e.dataTransfer.setData("rowIndex", index);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e) {
    const from = Number(e.dataTransfer.getData("rowIndex"));
    reorderRow(from, index);
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="flex border-b border-(--border) bg-(--surface)"
    >
      {/* ROW HEADER / HANDLE */}
      <div
        draggable
        onDragStart={onDragStart}
        className="
        sticky left-0
          w-12 shrink-0 flex items-center justify-center
          border-r border-(--border)
          text-xs text-(--muted)
          cursor-grab active:cursor-grabbing
          bg-(--surface-muted)
          select-none
        "
        title="Drag row"
      >
        <GripVertical size={14} className="mr-1 opacity-60" />
        {index + 1}
      </div>

      {/* ROW CELLS */}
      <div className="flex">
        {columnOrder.map((colId) => (
          <Cell
            key={colId}
            colId={colId}
            rowId={rowId}
            onCommit={(input, row, column) => {
              const parsed = column?.parse ? column.parse(input) : input;
              const error = column.validate?.(parsed) ?? null;
              updateCell(row.id, colId, parsed, error);
            }}
          />
        ))}
      </div>
    </div>
  );
}
