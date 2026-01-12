import { useEffect, useMemo } from "react";
import { buildVisibleRows } from "../../grouping";
import { useTableStore } from "../../store/useTableStore";
import { useVirtualizer } from "@tanstack/react-virtual";
import { GroupRow } from "./GroupRow";
import { Row } from "./Row";

export default function VirtualizedRow({ scrollRef }) {
  const effectiveRowOrder = useTableStore((s) =>
    s.sortedRowOrder.length
      ? s.sortedRowOrder
      : s.filteredRowOrder.length
      ? s.filteredRowOrder
      : s.rowOrder
  );

  const groupBy = useTableStore((s) => s.groupBy);
  const expandedGroups = useTableStore((s) => s.expandedGroups);
  const groups = useTableStore((s) => s.groups);

  /* -------------- Build visible rows ----------- */
  const visibleRows = useMemo(() => {
    if (!groups) {
      return effectiveRowOrder.map((rowId, i) => ({
        type: "row",
        rowId,
        index: i,
      }));
    }

    return buildVisibleRows(groups, expandedGroups);
  }, [groups, expandedGroups, effectiveRowOrder]);

  /* ---------------- Virtualizer ---------------- */
  const rowVirtualizer = useVirtualizer({
    count: visibleRows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => (visibleRows[index].type === "group" ? 40 : 31.3),
    overscan: 6,
  });

  /* ----- Re-measure on expand/collapse -------- */
  useEffect(() => {
    rowVirtualizer.measure();
  }, [visibleRows.length]);

  return (
    <div
      style={{
        height: rowVirtualizer.getTotalSize(),
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((vRow, i) => {
        const item = visibleRows[vRow.index];

        return (
          <div
            key={item.type === "group" ? `group-${item.groupId}` : item.rowId}
            className="absolute w-full top-0 left-0"
            style={{ transform: `translateY(${vRow.start}px)` }}
          >
            {item.type === "group" ? (
              <>
                <div className="w-full h-2" />
                <GroupRow
                  groupId={item.groupId}
                  label={item.label}
                  groupBy={groupBy}
                />
              </>
            ) : (
              <Row rowId={item.rowId} index={item.index} />
            )}
          </div>
        );
      })}
    </div>
  );
}
