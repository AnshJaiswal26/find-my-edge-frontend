import { memo } from "react";
import { ChevronRight } from "lucide-react";
import { useTableStore } from "@table/store/useTableStore";

export const GroupRow = memo(function GroupRow({ groupId, label, groupBy }) {
  const columnOrder = useTableStore((s) => s.columnOrder);
  const columnWidths = useTableStore((s) => s.columnWidths);
  const expanded = useTableStore((s) => !!s.expandedGroups[groupId]);
  const toggleGroup = useTableStore((s) => s.toggleGroup);
  const scrollEdge = useTableStore((s) => s.scrollEdge);

  const groupedColId = groupBy?.key;

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

      {columnOrder.map((colId) => {
        const isGroupColumn = colId === groupedColId;

        return (
          <div
            key={colId}
            style={{
              width: columnWidths[colId] ?? 150,
              ...(isGroupColumn &&
                scrollEdge && {
                  position: "sticky",
                  ...(scrollEdge === "right"
                    ? { left: 51, boxShadow: "2px 0px 3px rgba(0,0,0,0.12)" }
                    : {
                        right: 0,
                        borderLeft: "1px solid var(--border)",
                        boxShadow: "-2px 0px 3px rgba(0,0,0,0.12)",
                      }),
                  zIndex: 25,
                  background: "var(--surface-muted)",
                }),
            }}
            className="
              px-2 py-1 font-bold border border-(--border)
              overflow-hidden text-nowrap text-(--text-muted)
            "
          >
            {isGroupColumn ? label : ""}
          </div>
        );
      })}
    </div>
  );
});
