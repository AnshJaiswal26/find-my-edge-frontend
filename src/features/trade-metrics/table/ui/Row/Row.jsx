import { memo, useCallback, useRef, useState } from "react";
import { useTableStore } from "@features/trade-metrics/table/store";
import { Cell } from "../Cell/Cell";
import { useTradeStore } from "@shared/stores";
import { ContextMenu } from "./ContextMenu";

export const Row = memo(function Row({ rowId, index, groupId, groupBy }) {
  const updateTradeValue = useTradeStore((s) => s.updateTradeValue);
  const columnsOrder = useTableStore((s) => s.columnsOrder);
  const deleteRow = useTableStore((s) => s.deleteRow);
  const toggleHighlightRow = useTableStore((s) => s.toggleHighlightRow);
  const highlight = useTableStore((s) => s.highlightedRows[rowId]);
  const setCurrentRowId = useTableStore((s) => s.setCurrentRowId);
  const openPopup = useTableStore((s) => s.openPopup);

  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setMenuOpen(true);
  }, []);

  const handleAction = useCallback(
    (actionId) => {
      switch (actionId) {
        case "highlight":
          toggleHighlightRow(rowId);
          break;
        case "delete":
          deleteRow(rowId, groupId);
          break;
        case "score":
          openPopup("trade-score");
          setCurrentRowId(rowId);
          /* TODO: open score breakdown panel */ break;
      }
    },
    [rowId, groupId, toggleHighlightRow, deleteRow],
  );

  if (!rowId) return null;

  return (
    // position:relative is the anchor for the absolute menu
    <div
      onContextMenu={handleContextMenu}
      className={`
        relative flex w-max border-b border-(--border)
        bg-(--surface) hover:bg-(--hover)
        ${menuOpen ? "bg-(--hover)" : ""}
      `}
    >
      {/* ROW NUMBER HEADER */}
      <div
        ref={headerRef}
        className="
          sticky left-0 w-12 shrink-0
          flex items-center justify-center
          border-r border-b border-(--border)
          bg-(--surface-muted)
          font-bold z-40
          text-(--text-muted) text-xs
          select-none
        "
        onClick={() => setMenuOpen((open) => !open)}
      >
        {index + 1}
      </div>

      {/* CONTEXT MENU — absolute to this row, left edge = right of header */}
      {menuOpen && (
        <ContextMenu
          anchorRef={headerRef}
          onAction={handleAction}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* CELLS */}
      {columnsOrder.map((colId) => (
        <Cell
          key={colId}
          rowId={rowId}
          colId={colId}
          highlight={highlight}
          isGroupColumn={colId === groupBy?.key}
          onCommit={(value) => updateTradeValue(rowId, colId, value, groupId)}
        />
      ))}
    </div>
  );
});
