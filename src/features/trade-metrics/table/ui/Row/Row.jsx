import { memo } from "react";
import { useTableStore } from "@table/store/useTableStore";
import { Cell } from "../Cell/Cell";

export const Row = memo(function Row({ rowId, index, groupId }) {
  const columnOrder = useTableStore((s) => s.columnOrder);

  const updateCell = useTableStore((s) => s.updateCell);

  const onCommit = (value) => {
    updateCell(rowId, colId, value, groupId);
  };

  if (!rowId) return null;

  return (
    <div
      className={`relative flex w-max border-b border-(--border) bg-(--surface) hover:bg-(--hover)`}
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
        {columnOrder.map((colId) => (
          <Cell key={colId} rowId={rowId} colId={colId} onCommit={onCommit} />
        ))}
      </div>
    </div>
  );
});
