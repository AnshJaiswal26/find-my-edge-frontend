// components/Row.jsx
import { useTableStore } from "./store";
import { Cell } from "./Cell";
import { columnsById } from "./data";

export function Row({ row, index }) {
  const { reorderRow, columnOrder, updateCell } = useTableStore();

  function onDragStart(e) {
    e.dataTransfer.setData("rowIndex", index);
  }

  function onDrop(e) {
    const from = Number(e.dataTransfer.getData("rowIndex"));
    reorderRow(from, index);
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="flex border-b border-(--border) text-(--text) bg-(--surface)"
    >
      {columnOrder.map((colId) => {
        const column = columnsById[colId];
        const cell = row.cells[colId];

        return (
          <Cell
            key={colId}
            cell={cell}
            column={column}
            onCommit={(input) => {
              const parsed = column.parse ? column.parse(input) : input;
              const error = column.validate?.(parsed) ?? null;
              updateCell(row.id, colId, parsed, error);
            }}
          />
        );
      })}
    </div>
  );
}
