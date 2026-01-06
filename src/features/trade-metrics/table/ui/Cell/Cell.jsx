import { memo, useState } from "react";
import { useTableStore } from "../../store/useTableStore";
import { CellInput } from "./CellInput";
import { CellSelect } from "./CellSelect";
import { CellDisplay } from "./CellDisplay";

export const Cell = memo(function Cell({ rowId, colId }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const cell = useTableStore((s) => s.rowsById[rowId].cells[colId]);

  const width = useTableStore((s) => s.columnWidths[colId] ?? 150);

  const type = useTableStore((s) => s.columnsById[colId].type);

  const updateCell = useTableStore((s) => s.updateCell);

  const onCommit = (value) => {
    updateCell(rowId, colId, value);
  };

  if (editing) {
    const Editor = type === "select" ? CellSelect : CellInput;

    return (
      <div
        style={{ width }}
        className="border-1 border-(--info) overflow-hidden"
      >
        <Editor
          colId={colId}
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
      type={type}
      cell={cell}
      colId={colId}
      rowId={rowId}
      width={width}
      setDraft={setDraft}
      setEditing={setEditing}
    />
  );
});
