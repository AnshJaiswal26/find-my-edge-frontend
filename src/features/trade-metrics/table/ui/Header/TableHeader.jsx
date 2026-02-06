import { ColumnHeader } from "./ColumnHeader";
import { useTableStore } from "@table/store/useTableStore";

export function TableHeader({ tableRef }) {
  const columnOrder = useTableStore((s) => s.columnOrder);
  const groupBy = useTableStore((s) => s.groupBy?.key);
  const scrollEdge = useTableStore((s) => s.scrollEdge);

  return (
    <div
      className="
        w-max
        sticky top-0 left-0
        flex border-b border-(--border)
        bg-(--surface-muted) z-3
      "
    >
      {/* SN HEADER */}
      <div
        className="sticky top-0 left-0
          w-12 shrink-0
          border-r border-(--border)
          bg-(--surface-muted) z-40
        "
      />

      {/* COLUMN HEADERS */}
      <div className="flex">
        {columnOrder?.map((id, index) => (
          <ColumnHeader
            key={id}
            colId={id}
            index={index}
            isStickyFirst={index <= 4}
            isStickyLast={index >= columnOrder.length - 4}
            tableRef={tableRef}
            scrollEdge={scrollEdge}
            isGroupColumn={groupBy == id}
          />
        ))}
      </div>
    </div>
  );
}
