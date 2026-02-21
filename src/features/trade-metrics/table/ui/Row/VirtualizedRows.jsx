import { useEffect, useMemo } from "react";
import { buildVisibleRows } from "@features/trade-metrics/table/grouping";
import { useTableStore } from "@features/trade-metrics/table/store";
import { useVirtualizer } from "@tanstack/react-virtual";
import { GroupRow } from "./GroupRow";
import { Row } from "./Row";
import { useTradeStore } from "@shared/stores";

export default function VirtualizedRow({ scrollRef }) {
  const rowsOrder = useTradeStore((s) => s.tradesOrder);
  const effectiveRowOrder = useTableStore((s) =>
    s.sortedRowOrder.length
      ? s.sortedRowOrder
      : s.filteredRowOrder.length
        ? s.filteredRowOrder
        : rowsOrder,
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
    estimateSize: (index) => (visibleRows[index].type === "group" ? 45 : 31.3),
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
            className="absolute top-0 left-0 w-max min-w-full"
            style={{ transform: `translateY(${vRow.start}px)` }}
          >
            {item.type === "group" ? (
              <>
                <div className="w-full h-3" />
                <GroupRow
                  groupId={item.groupId}
                  meta={item.meta}
                  groupBy={groupBy}
                />
                <div className="w-full h-3" />
              </>
            ) : (
              <Row
                rowId={item.rowId}
                index={item.index}
                groupId={item?.groupId}
                groupBy={groupBy}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
