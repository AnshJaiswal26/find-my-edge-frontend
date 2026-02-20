import { memo, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { useTableStore } from "@table/store/useTableStore";
import { formatGroupValue } from "@utils";
import { useTradeStore } from "@stores";

export const GroupCell = memo(function GroupCell({
  colId,
  groupedColId,
  meta,
}) {
  const width = useTableStore((s) => s.columnWidths[colId] ?? 150);
  const column = useTradeStore((s) => s.schemasById[colId]);

  const isGroupColumn = colId === groupedColId;

  const displayValue = useMemo(
    () => formatGroupValue(meta, column.semanticType, column.display),
    [meta?.value, column.semanticType, column.display],
  );

  return (
    <div
      style={{ width }}
      className={`
        px-2 py-1 font-bold border border-(--border)
        overflow-hidden text-nowrap text-(--text-muted)
        ${isGroupColumn ? "stick-left bg-(--surface-muted)" : ""}
      `}
    >
      {isGroupColumn ? displayValue || "EMPTY" : ""}
    </div>
  );
});

export const GroupRow = memo(function GroupRow({ groupId, meta, groupBy }) {
  const columnsOrder = useTableStore((s) => s.columnsOrder);
  const expanded = useTableStore((s) => !!s.expandedGroups[groupId]);
  const toggleGroup = useTableStore((s) => s.toggleGroup);

  return (
    <div
      className={`flex border-t border-(--border) h-7.5 bg-(--surface-muted) cursor-pointer ${!expanded ? "!border-y" : ""}`}
      onClick={() => toggleGroup(groupId)}
    >
      {/* 🔹 STICKY GROUP TOGGLE HANDLE */}
      <div
        className="
          sticky left-0 z-30
          w-12 shrink-0
          flex items-center justify-center
          border-r border-(--border)
          bg-(--surface-muted)
        "
      >
        <ChevronRight
          size={14}
          className={`transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </div>

      {columnsOrder.map((colId, i) => (
        <GroupCell
          key={i}
          colId={colId}
          groupedColId={groupBy?.key}
          meta={meta}
        />
      ))}
    </div>
  );
});
