import { memo, useEffect, useState } from "react";
import { useTableStore } from "@features/trade-metrics/table/store";
import { CellInput } from "./CellInput";
import { CellSelect } from "./CellSelect";
import { CellDisplay } from "./CellDisplay";
import { useCellValue } from "@features/trade-metrics/table/hooks";
import { useTradeStore } from "@shared/stores";

export const Cell = memo(function Cell({
  rowId,
  colId,
  onCommit,
  highlight,
  isGroupColumn,
}) {
  const [editing, setEditing] = useState(false);

  const value = useCellValue(rowId, colId);

  // console.log(value, colId);
  const width = useTableStore((s) => s.columnWidths[colId] ?? 150);
  const column = useTradeStore((s) => s.schemasById[colId]);

  const type = column.semanticType;

  /* ---------- Keep draft synced with store value ---------- */
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!editing) {
      setDraft(value);
    }
  }, [value, editing]);

  const isHidden = column.hidden === true;

  if (isHidden) return null;

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
        value={value}
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
