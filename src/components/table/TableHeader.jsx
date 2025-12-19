// components/TableHeader.jsx
import { ColumnHeader } from "./ColumnHeader";
import { useTableStore } from "./store";
import { columnsById } from "./data";

export function TableHeader() {
  const columnOrder = useTableStore((s) => s.columnOrder);

  return (
    <div className="flex border-b border-(--border)">
      {columnOrder.map((id, index) => (
        <ColumnHeader key={id} column={columnsById[id]} index={index} />
      ))}
    </div>
  );
}
