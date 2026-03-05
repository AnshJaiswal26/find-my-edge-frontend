import { Cell } from "./Cell";

export const TradeRow = ({ trade: t }) => (
  <div className="grid grid-cols-9 border-b border-(--border-muted)/95 hover:bg-(--surface-hover) transition">
    <Cell>{t.symbol}</Cell>
    <Cell>{t.entry}</Cell>
    <Cell>{t.exit}</Cell>
    <Cell>{t.qty}</Cell>
    <Cell>{t.entryTime}</Cell>
    <Cell>{t.exitTime}</Cell>
    <Cell align="right" positive={t.pnl >= 0}>
      ₹{Number(t.pnl).toFixed(2)}
    </Cell>
    <Cell align="right" positive={t.pnl >= 0}>
      ₹{Number(t.pnl + t.charges).toFixed(2)}
    </Cell>
    <Cell align="right" positive={t.pnl >= 0}>
      ₹{Number(t.charges).toFixed(2)}
    </Cell>
  </div>
);
