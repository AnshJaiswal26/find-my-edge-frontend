import { memo } from "react";
import { ChevronRight, LockKeyholeIcon } from "lucide-react";
import { useTableStore } from "../../store/useTableStore";

export const GroupRow = memo(function GroupRow({ groupId, label }) {
  const columnOrder = useTableStore((s) => s.columnOrder);
  const columnWidths = useTableStore((s) => s.columnWidths);
  const expanded = useTableStore((s) => !!s.expandedGroups[groupId]);
  const toggleGroup = useTableStore((s) => s.toggleGroup);
  const groupBy = useTableStore((s) => s.groupBy);

  return (
    <div
      className="flex border-y border-(--border) bg-(--surface-disabled) cursor-pointer"
      onClick={() => toggleGroup(groupId)}
    >
      {/* ✅ STICKY HANDLE */}
      <div
        className="
          sticky left-0 z-20
          w-12 shrink-0
          flex items-center justify-center
          border-r border-(--border)
          bg-(--surface-disabled)
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
          {colId === groupBy ? label : ""}
        </div>
      ))}

      {/* non-sticky columns */}
      {/* <div className="w-[120px]" /> */}
      {/* <div className="w-[140px]" /> */}
    </div>
  );
});
