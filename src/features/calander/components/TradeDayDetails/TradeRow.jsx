import { Cell } from "./Cell";
import { useMemo } from "react";
import { formatValue } from "@shared/utils";

export const TradeRow = ({ trade: t, colWidths }) => {
  const { entryTime, exitTime } = useMemo(() => {
    const entryTime = formatValue(t.entryTime, "time", {
      format: "hh:mm:ss A",
    });
    const exitTime = formatValue(t.exitTime, "time", { format: "hh:mm:ss A" });

    return { entryTime, exitTime };
  });
  return (
    <div className="flex border-b border-(--border-muted)/95 hover:bg-(--surface-hover) transition">
      {[t.symbol, t.entryPrice, t.exitPrice, t.qty, entryTime, exitTime].map(
        (text, i) => (
          <div key={i} style={{ width: colWidths[i] }} className="flex-none">
            <Cell>{text}</Cell>
          </div>
        ),
      )}

      {[t.pnl, t.pnl + t.charges, t.charges].map((value, i) => (
        <div key={i} style={{ width: colWidths[i + 6] }} className="flex-none">
          <Cell positive={value >= 0}>₹{Number(value).toFixed(2)}</Cell>
        </div>
      ))}
    </div>
  );
};
