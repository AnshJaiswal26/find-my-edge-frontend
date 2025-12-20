// components/Cell.jsx
import { useState } from "react";
import { formatValue, TONE_CLASS } from "./utils";
import { useTableStore } from "./store";
import { Select } from "@ui";

export function Cell({ rowId, colId, onCommit }) {
  const row = useTableStore((s) => s.rowsById[rowId]);
  const column = useTableStore((s) => s.columnsById[colId]);

  const cell = row.cells[colId];

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const columnWidths = useTableStore((s) => s.columnWidths);
  const draggingColumnId = useTableStore((s) => s.draggingColumnId);

  const isColumnDragging = draggingColumnId === column.id;

  const editable = column.type !== "computed" && column.editable !== false;

  const tone = column.conditionalStyle?.(cell.value) ?? "neutral";

  const width = columnWidths[column.id] ?? 200;

  const className = "w-full h-full px-2 py-1 outline-0";

  if (editing && editable) {
    if (column.type === "select") {
      return (
        <div style={{ width }} className="border-2 border-(--info)">
          {/* <Select
            buttonClass={className}
            options={column.options}
            value={draft}
            onChange={(v) => setDraft(v)}
            onBlur={() => {
              onCommit(draft, row, column);
              setEditing(false);
            }}
          /> */}
          <select
            className={className}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              onCommit(draft, row, column);
              setEditing(false);
            }}
          >
            <option value="" className="bg-(--surface)">
              —
            </option>
            {column.options.map((o) => (
              <option key={o} className="bg-(--surface)">
                {o}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div style={{ width }} className="border-2 border-(--info)">
        <input
          className={className}
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            onCommit(draft, row, column);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onCommit(draft, column);
              setEditing(false);
            }
            if (e.key === "Escape") setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{ width }}
      className={`px-2 py-1 cursor-pointer border-r-1 border-r-(--border) ${
        TONE_CLASS[tone]
      } ${isColumnDragging ? "bg-(--info-soft)!" : ""}`}
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
}
