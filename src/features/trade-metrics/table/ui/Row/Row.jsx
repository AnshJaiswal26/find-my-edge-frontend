import { memo } from "react";
import { useTableStore } from "../../store/useTableStore";
import { Cell } from "../Cell/Cell";

export const Row = memo(function Row({ rowId, index }) {
  const columnOrder = useTableStore((s) => s.columnOrder);

  if (!rowId) return null;

  return (
    <div className="flex">
      <div className="relative flex w-max border-b border-(--border) bg-(--surface)">
        {/* HANDLE */}
        <div
          className="
            sticky left-0 w-12 shrink-0
            flex items-center justify-center
            border-r border-(--border)
            cursor-grab active:cursor-grabbing
            bg-(--surface-disabled)
            group z-2
          "
        >
          {index + 1}
        </div>

        {/* CELLS */}
        <div className="flex">
          {columnOrder.map((colId) => (
            <Cell key={colId} rowId={rowId} colId={colId} />
          ))}
        </div>
      </div>
    </div>
  );
});
