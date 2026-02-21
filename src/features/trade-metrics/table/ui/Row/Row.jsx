import { memo, useState } from "react";
import { useTableStore } from "@features/trade-metrics/table/store";
import { Cell } from "../Cell/Cell";
import { HighlighterIcon, Trash2 } from "lucide-react";
import { useTradeStore } from "@shared/stores";

export const Row = memo(function Row({ rowId, index, groupId, groupBy }) {
  const updateTradeValue = useTradeStore((s) => s.updateTradeValue);

  const columnsOrder = useTableStore((s) => s.columnsOrder);
  const deleteRow = useTableStore((s) => s.deleteRow);

  const toggleHighlightRow = useTableStore((s) => s.toggleHighlightRow);
  const highlight = useTableStore((s) => s.highlightedRows[rowId]);

  const [hover, setHover] = useState(false);

  if (!rowId) return null;

  return (
    <div
      className={`
        relative flex w-max border-b border-(--border)
        bg-(--surface) hover:bg-(--hover)`}
    >
      {/* HANDLE / HEADER */}
      <div
        className="
          sticky left-0 w-12 shrink-0
          flex items-center justify-center
          border-1 border-(--border)
          bg-(--surface-muted)
          font-bold z-40
          group
          text-(--text)
        "
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {index + 1}

        {/* MINI OVERLAY */}
        {hover && (
          <div
            className="
            absolute right-0 top-1/2 -translate-y-1/2 translate-x-full
            flex items-center gap-1
          "
          >
            <button
              onClick={() => toggleHighlightRow(rowId)}
              className="
              pointer-events-auto
              text-xs px-2 py-0.5 rounded
              bg-yellow-500/90 hover:bg-yellow-400
              text-black shadow
            "
              title="Highlight row"
            >
              <HighlighterIcon size={16} />
            </button>

            <button
              onClick={() => deleteRow(rowId, groupId)}
              className="
              pointer-events-auto
              text-xs px-2 py-0.5 rounded
              bg-red-600/90 hover:bg-red-500
              text-white shadow
            "
              title="Delete row"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* CELLS */}

      {columnsOrder.map((colId) => (
        <Cell
          key={colId}
          rowId={rowId}
          colId={colId}
          highlight={highlight}
          isGroupColumn={colId === groupBy?.key}
          onCommit={(value) => {
            updateTradeValue(rowId, colId, value, groupId);
          }}
        />
      ))}
    </div>
  );
});
