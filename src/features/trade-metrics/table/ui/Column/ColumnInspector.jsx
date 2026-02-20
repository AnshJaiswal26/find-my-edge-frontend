import { useMemo, useState } from "react";
import { useTableStore } from "@table/store/useTableStore";
import { ChevronLeft } from "lucide-react";
import { Divider } from "@layout";
import { SCHEMA_SOURCE, SCHEMA_TYPES } from "@lib/analytics/schema";
import { useTradeStore } from "@stores";

export function ColumnInspector() {
  const selectedColId = useTableStore((s) => s.selectedColumn?.id);
  const columnsById = useTradeStore((s) => s.schemasById);

  if (!selectedColId) return null;

  const column = columnsById[selectedColId];

  if (!column) return null;
  if (column.source !== SCHEMA_SOURCE.COMPUTED) return null;

  return (
    <ColumnInspectorContent column={column} selectedColId={selectedColId} />
  );
}

function ColumnInspectorContent({ column, selectedColId }) {
  const tradesById = useTradeStore((s) => s.tradesById);
  const derivedByTradeId = useTradeStore((s) => s.derivedByTradeId);
  const rowsOrder = useTradeStore((s) => s.tradesOrder);

  const rowsById = useMemo(() => {
    const result = {};

    rowsOrder.forEach((id) => {
      result[id] = {
        ...tradesById[id],
        ...(derivedByTradeId[id] || {}),
      };
    });

    return result;
  }, [rowsOrder, tradesById, derivedByTradeId]);

  const [open, setOpen] = useState(false);

  const values = useMemo(() => {
    const nums = [];
    rowsOrder.forEach((id) => {
      const v = Number(rowsById?.[id]?.[selectedColId]);
      if (Number.isFinite(v)) nums.push(v);
    });
    return nums;
  }, [rowsOrder, rowsById, selectedColId]);

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
