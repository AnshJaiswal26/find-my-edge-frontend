import { memo } from "react";
import { ChevronRight } from "lucide-react";
import { useTableStore } from "@table/store/useTableStore";

export const GroupRow = memo(function GroupRow({ groupId, label, groupBy }) {
  const columnOrder = useTableStore((s) => s.columnOrder);
  const columnWidths = useTableStore((s) => s.columnWidths);
  const expanded = useTableStore((s) => !!s.expandedGroups[groupId]);
  const toggleGroup = useTableStore((s) => s.toggleGroup);

  return (
    <div
      className="flex border-y border-(--border) bg-(--surface-muted) cursor-pointer"
      onClick={() => toggleGroup(groupId)}
    >
      {/* ✅ STICKY HANDLE */}
      <div
        className="
          sticky left-0 z-20
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

      {columnOrder.map((colId) => (
        <div
          key={colId}
          style={{ width: columnWidths[colId] ?? 150 }}
          className="px-2 py-1 font-medium border-r border-(--border) overflow-ellipsis overflow-hidden text-nowrap"
        >
          {colId === groupBy.key ? label : ""}
        </div>
      ))}
    </div>
  );
});
