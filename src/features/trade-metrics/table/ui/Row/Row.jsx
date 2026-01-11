import { memo, useEffect, useMemo } from "react";
import { useTableStore } from "../../store/useTableStore";
import { Cell } from "../Cell/Cell";
import { useVirtualizer } from "@tanstack/react-virtual";
import { buildVisibleRows, groupRowsBy } from "../../grouping";
import { GroupRow } from "./GroupRow";
import { createGetGroupKey } from "../../grouping/createGetGroupKey";
import { filterOptions } from "@utils";

export const VirtualizedRow = ({ scrollRef }) => {
  const rowOrder = useTableStore((s) => s.rowOrder);
  const filteredRowOrder = useTableStore((s) => s.filteredRowOrder);
  const groupBy = useTableStore((s) => s.groupBy);
  const expandedGroups = useTableStore((s) => s.expandedGroups);

  const effectiveRowOrder = filteredRowOrder.length
    ? filteredRowOrder
    : rowOrder;

  const groups = useMemo(() => {
    if (!groupBy) return null;

    const { rowsById } = useTableStore.getState();

    const getGroupKey = createGetGroupKey({
      rowsById,
      groupBy,
    });

    const labels =
      groupBy.mode === "condition"
        ? {
            MATCHED: `${filterOptions[groupBy.operation]} ${groupBy.value} ${
              `to ${groupBy?.valueTo}` ?? ""
            }`,
            NOT_MATCHED: `Not ${filterOptions[groupBy.operation]} ${
              groupBy.value
            } ${`to ${groupBy?.valueTo}` ?? ""}`,
          }
        : null;

    return groupRowsBy({
      rowOrder: effectiveRowOrder,
      getGroupKey,
      groupLabels: labels,
    });
  }, [effectiveRowOrder, groupBy]);

  /* ---------------- Build visible rows ---------------- */
  const visibleRows = useMemo(() => {
    if (!groups) {
      return effectiveRowOrder.map((rowId) => ({
        type: "row",
        rowId,
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

  /* ---------------- Re-measure on expand/collapse ---------------- */
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
            style={{
              transform: `translateY(${vRow.start}px)`,
            }}
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
              <Row rowId={item.rowId} index={vRow.index} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Row = memo(function Row({ rowId, index }) {
  const columnOrder = useTableStore((s) => s.columnOrder);

  if (!rowId) return null;

  return (
    <div
      className={`relative flex w-max border-b border-(--border) bg-(--surface)`}
    >
      {/* HANDLE */}
      <div
        className={`
            sticky left-0 w-12 shrink-0
            flex items-center justify-center
            border-r border-(--border)
            cursor-grab active:cursor-grabbing
            bg-(--surface-disabled)
            group z-2`}
      >
        {index + 1}
      </div>

      {/* CELLS */}
      <div className="flex">
        {columnOrder.map((colId, i) => (
          <Cell key={colId} rowId={rowId} colId={colId} />
        ))}
      </div>
    </div>
  );
});
