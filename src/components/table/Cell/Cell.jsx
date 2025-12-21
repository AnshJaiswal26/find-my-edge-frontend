// components/Cell.jsx
import { useState } from "react";
import { useTableStore } from "../store";
import { CellSelect } from "./CellSelect";
import { CellInput } from "./CellInput";
import { CellDisplay } from "./CellDisplay";

export function Cell({ rowId, colId, onCommit }) {
  const row = useTableStore((s) => s.rowsById[rowId]);
  const column = useTableStore((s) => s.columnsById[colId]);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const width = useTableStore((s) => s.columnWidths[column.id] ?? 150);

  const CellComponent = column.type === "select" ? CellSelect : CellInput;

  if (editing) {
    return (
      <div style={{ width }} className="border-2 border-(--info)">
        <CellComponent
          row={row}
          column={column}
          draft={draft}
          setDraft={setDraft}
          onCommit={onCommit}
          setEditing={setEditing}
        />
      </div>
    );
  }

  return (
    <CellDisplay
      row={row}
      column={column}
      width={width}
      setDraft={setDraft}
      setEditing={setEditing}
    />
  );
}
