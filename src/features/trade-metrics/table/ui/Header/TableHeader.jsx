import { ColumnHeader } from "./ColumnHeader";
import { useTableStore } from "@features/trade-metrics/table/store";

export function TableHeader({ tableRef }) {
  const columnsOrder = useTableStore((s) => s.columnsOrder);
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
        {columnsOrder?.map((id, index) => (
          <ColumnHeader
            key={id}
            colId={id}
            index={index}
            isStickyFirst={index <= 4}
            isStickyLast={index >= columnsOrder.length - 4}
            tableRef={tableRef}
            scrollEdge={scrollEdge}
            isGroupColumn={groupBy == id}
          />
        ))}
      </div>
    </div>
  );
}
