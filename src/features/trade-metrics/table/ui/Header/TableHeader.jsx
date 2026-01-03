import { ColumnHeader } from "./ColumnHeader";
import { useTableStore } from "../../store/useTableStore";

export function TableHeader() {
  const columnOrder = useTableStore((s) => s.columnOrder);

  return (
    <div
      className="
       w-max
        sticky top-0 left-0
        flex border-b border-(--border)
        bg-(--surface-disabled) z-3
      "
    >
      {/* SN HEADER */}
      <div
        className="sticky top-0 left-0
          w-12 shrink-0 flex items-center justify-center
          border-r border-(--border)
          text-xs font-medium text-(--muted)
          select-none  bg-(--surface-disabled) z-3
        "
      />

      {/* COLUMN HEADERS */}
      <div className="flex">
        {columnOrder?.map((id, index) => (
          <ColumnHeader key={id} colId={id} index={index} />
        ))}
      </div>
    </div>
  );
}
