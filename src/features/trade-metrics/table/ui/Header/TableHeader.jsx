import { ColumnHeader } from "./ColumnHeader";
import { useTableStore } from "../../store/useTableStore";

export function TableHeader({ tableRef }) {
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
          w-12 shrink-0
          border-r border-(--border)
          bg-(--surface-disabled) z-3
        "
      />

      {/* COLUMN HEADERS */}
      <div className="flex">
        {columnOrder?.map((id, index) => (
          <ColumnHeader key={id} colId={id} index={index} tableRef={tableRef} />
        ))}
      </div>
    </div>
  );
}
