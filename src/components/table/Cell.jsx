// components/Cell.jsx
import { useState } from "react";
import { formatValue, TONE_CLASS } from "./utils";
import { useTableStore } from "./store";

export function Cell({ cell, column, onCommit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const columnWidths = useTableStore((s) => s.columnWidths);

  const editable = column.type !== "computed" && column.editable !== false;

  const tone = column.conditionalStyle?.(cell.value) ?? "neutral";

  const width = columnWidths[column.id] ?? 200;

  if (editing && editable) {
    if (column.type === "select") {
      return (
        <div
          className="px-2 py-1 border-r-1 border-(--border)"
          style={{ width }}
        >
          <select
            className="w-full outline-0"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              onCommit(draft);
              setEditing(false);
            }}
          >
            <option value="">—</option>
            {column.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div style={{ width }} className="px-2 py-1 border-r-1 border-(--border)">
        <input
          className="w-full outline-0"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            onCommit(draft);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onCommit(draft);
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
      className={`px-2 py-1 cursor-pointer border-r-1 border-(--border) ${TONE_CLASS[tone]}`}
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
