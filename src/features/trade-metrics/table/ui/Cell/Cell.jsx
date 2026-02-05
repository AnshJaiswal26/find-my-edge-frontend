import { memo, useEffect, useState } from "react";
import { useTableStore } from "@table/store/useTableStore";
import { CellInput } from "./CellInput";
import { CellSelect } from "./CellSelect";
import { CellDisplay } from "./CellDisplay";

export const Cell = memo(function Cell({
  rowId,
  colId,
  onCommit,
  scrollEdge,
  isStickyColumn,
}) {
  const [editing, setEditing] = useState(false);

  const cell = useTableStore((s) => s.rowsById[rowId].cells[colId]);
  const width = useTableStore((s) => s.columnWidths[colId] ?? 150);
  const column = useTableStore((s) => s.columnsById[colId]);

  const type = column.type;

  /* ---------- Keep draft synced with store value ---------- */
  const [draft, setDraft] = useState(cell.value);

  useEffect(() => {
    if (!editing) {
      setDraft(cell.value);
    }
  }, [cell.value, editing]);

  /* ---------- Sticky logic for grouped column ---------- */
  const isGroupColumn = isStickyColumn;

  const stickyStyle =
    isGroupColumn && scrollEdge
      ? {
          position: "sticky",
          ...(scrollEdge === "right"
            ? { left: 51, boxShadow: "2px 0px 3px rgba(0,0,0,0.12)" }
            : {
                right: 0,
                borderLeft: "1px solid var(--border)",
                boxShadow: "-2px 0px 3px rgba(0,0,0,0.12)",
              }),
          color: "var(--text)",
          zIndex: 2,
          background: "var(--surface)",
        }
      : {};

  /* ================= EDIT MODE ================= */
  if (editing) {
    const Editor = type === "select" ? CellSelect : CellInput;

    return (
      <div
        style={{ width, ...stickyStyle }}
        className="border border-(--info) overflow-hidden"
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
    <div style={stickyStyle} className="h-full!">
      <CellDisplay
        type={type}
        cell={cell}
        colId={colId}
        rowId={rowId}
        width={width}
        setDraft={setDraft}
        setEditing={setEditing}
      />
    </div>
  );
});
