import { memo, useEffect, useState } from "react";
import { useTableStore } from "@table/store/useTableStore";
import { CellInput } from "./CellInput";
import { CellSelect } from "./CellSelect";
import { CellDisplay } from "./CellDisplay";

export const Cell = memo(function Cell({
  rowId,
  colId,
  onCommit,
  highlight,
  isGroupColumn,
}) {
  const [editing, setEditing] = useState(false);

  const cell = useTableStore((s) => s.rowsById[rowId]?.cells[colId]);
  const width = useTableStore((s) => s.columnWidths[colId] ?? 150);
  const column = useTableStore((s) => s.columnsById[colId]);

  const type = column.semanticType;

  /* ---------- Keep draft synced with store value ---------- */
  const [draft, setDraft] = useState(cell.value);

  useEffect(() => {
    if (!editing) {
      setDraft(cell.value);
    }
  }, [cell.value, editing]);

  /* ================= EDIT MODE ================= */
  if (editing) {
    const Editor = column.type === "select" ? CellSelect : CellInput;

    return (
      <div
        style={{ width }}
        className={`border border-(--info) overflow-hidden ${isGroupColumn ? "stick-left bg-(--surface-muted) text-(--text)" : ""}`}
      >
        <Editor
          colId={colId}
          draft={draft}
          setDraft={setDraft}
          onCommit={(value) => {
            onCommit(value);
            setEditing(false);
          }}
          setEditing={setEditing}
        />
      </div>
    );
  }

  /* ================= DISPLAY MODE ================= */
  return (
    <div
      className={`h-full! ${highlight ? "bg-(--warning) text-black" : ""} ${isGroupColumn ? "stick-left bg-(--surface)" : ""}`}
    >
      <CellDisplay
        type={type}
        cell={cell}
        colId={colId}
        rowId={rowId}
        width={width}
        display={column.display}
        setDraft={setDraft}
        setEditing={setEditing}
      />
    </div>
  );
});
