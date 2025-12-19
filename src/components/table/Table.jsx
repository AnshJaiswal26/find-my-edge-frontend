// components/Table.jsx
import { useEffect } from "react";
import { useTableStore } from "./store";
import { TableHeader } from "./TableHeader";
import { Row } from "./Row";

export function Table() {
  const { rowOrder, rowsById, initDemoData } = useTableStore();

  useEffect(() => {
    initDemoData();
  }, []);

  return (
    <div className="border rounded overflow-x-auto w-full border-(--border) text-(--text)">
      <div className="min-w-max">
        <TableHeader />
        {rowOrder.map((rowId, index) => (
          <Row key={rowId} row={rowsById[rowId]} index={index} />
        ))}
      </div>
    </div>
  );
}
