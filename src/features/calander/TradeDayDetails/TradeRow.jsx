import { Cell } from "./Cell";

export const TradeRow = ({ trade: t, colWidths }) => (
  <div className="flex border-b border-(--border-muted)/95 hover:bg-(--surface-hover) transition">
    {[t.symbol, t.entryPrice, t.exitPrice, t.qty, t.entryTime, t.exitTime].map(
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
