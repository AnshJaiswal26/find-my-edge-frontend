import { useMemo } from "react";
import { useTableStore } from "@table/store/useTableStore";

export function useNumericColumns() {
  const columnsById = useTableStore((s) => s.columnsById);

  const numericColumns = useMemo(() => {
    return Object.values(columnsById).filter(
      (c) =>
        c.type === "number" ||
        c.type.includes("computed") ||
        c.type === "date" ||
        c.type === "time"
    );
  }, [columnsById]);

  const labelToId = useMemo(() => {
    const map = {};
    numericColumns.forEach((c) => {
      map[c.label.toLowerCase()] = c.id;
    });
    return map;
  }, [numericColumns]);

  return { numericColumns, labelToId };
}
