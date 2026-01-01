import { useMemo, useState } from "react";
import { useTableStore } from "../../store/useTableStore";
import { ChevronLeft } from "lucide-react";
import { Divider } from "@layout";

export function ColumnInspector() {
  const selectedColId = useTableStore((s) => s.selectedColumn?.id);
  const columnsById = useTableStore((s) => s.columnsById);

  if (!selectedColId) return null;

  const column = columnsById[selectedColId];
  if (!column) return null;
  if (column.type !== "number" && column.type !== "computed") return null;

  return (
    <ColumnInspectorContent column={column} selectedColId={selectedColId} />
  );
}

function ColumnInspectorContent({ column, selectedColId }) {
  const rowsById = useTableStore((s) => s.rowsById);
  const rowOrder = useTableStore((s) => s.rowOrder);

  const [open, setOpen] = useState(false);

  const values = useMemo(() => {
    const nums = [];
    rowOrder.forEach((id) => {
      const v = Number(rowsById[id]?.cells[selectedColId]?.value);
      if (Number.isFinite(v)) nums.push(v);
    });
    return nums;
  }, [rowOrder, rowsById, selectedColId]);

  const stats = useMemo(() => {
    if (!values.length) return null;
    const sum = values.reduce((a, b) => a + b, 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = sum / values.length;
    return { sum, min, max, avg };
  }, [values]);

  if (!stats) return null;

  return (
    <div className="flex items-center gap-3 text-xs text-(--text)">
      {/* INLINE DETAILS */}
      {open && (
        <>
          <div className="flex items-center gap-2 whitespace-nowrap">
            {column.formula && (
              <InlineStat label="F" formula={column.formula} />
            )}
            <Divider vertical />
            <InlineStat label="Sum" value={stats.sum} />
            <Divider vertical />
            <InlineStat label="Max" value={stats.max} />
            <Divider vertical />
            <InlineStat label="Min" value={stats.min} />
            <Divider vertical />
            <InlineStat label="Avg" value={stats.avg} />
          </div>
        </>
      )}

      {/* CLICKABLE CORE */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-(--hover) px-2 py-1 rounded select-none"
        onClick={() => setOpen((o) => !o)}
      >
        <ChevronLeft
          size={13}
          className={`transition-all ${open ? "rotate-180" : ""}`}
        />
        <span className="font-medium whitespace-nowrap">{column.label}</span>
      </div>
    </div>
  );
}

function InlineStat({ label, value, formula }) {
  const color = formula
    ? "text-(--info)"
    : value > 0
    ? "text-(--success)"
    : value < 0
    ? "text-(--error)"
    : "text-(--text)";
  return (
    <span className="flex items-center gap-1">
      <span className="text-(--text-muted) font-serif">{label}:</span>
      <span className={`font-medium ${color}`}>
        {formula ? formula : Number(value).toFixed(2)}
      </span>
    </span>
  );
}
