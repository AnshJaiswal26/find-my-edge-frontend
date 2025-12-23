// components/TableHeader.jsx
import { ColumnHeader } from "./ColumnHeader";
import { useTableStore } from "../store";

export function TableHeader() {
  const columnOrder = useTableStore((s) => s.columnOrder);

  console.log(columnOrder);

  return (
    <div
      className="
        sticky top-0 left-0 z-20
        flex border-b border-(--border)
        bg-(--surface-disabled)
      "
    >
      {/* SN HEADER */}
      <div
        className="sticky top-0 left-0 z-20
          w-12 shrink-0 flex items-center justify-center
          border-r border-(--border)
          text-xs font-medium text-(--muted)
          select-none  bg-(--surface-disabled)

        "
      />

      {/* COLUMN HEADERS */}
      <div className="flex">
        {columnOrder.map((id, index) => (
          <ColumnHeader key={id} colId={id} index={index} />
        ))}
      </div>
    </div>
  );
}
