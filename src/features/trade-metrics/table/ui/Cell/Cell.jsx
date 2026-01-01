import { useState } from "react";
import { useTableStore } from "../../store/useTableStore";
import { CellSelect } from "./CellSelect";
import { CellInput } from "./CellInput";
import { CellDisplay } from "./CellDisplay";

export function Cell({ rowId, colId, onCommit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const cell = useTableStore((s) => s.rowsById[rowId].cells[colId]);

  const width = useTableStore((s) => s.columnWidths[colId] ?? 150);
  const isSelect = useTableStore((s) => s.columnsById[colId].type === "select");

  const CellComponent = isSelect ? CellSelect : CellInput;

  if (editing) {
    return (
      <div style={{ width }} className="border-1 border-(--info)">
        <CellComponent
          rowId={rowId}
          colId={colId}
          cell={cell}
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
      rowId={rowId}
      colId={colId}
      cell={cell}
      width={width}
      setDraft={setDraft}
      setEditing={setEditing}
    />
  );
}
