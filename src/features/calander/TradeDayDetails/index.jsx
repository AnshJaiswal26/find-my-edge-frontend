import { Container } from "@shared/components/layout";
import { useCalendarStore } from "../store/uesCalendarStore";
import { Cell } from "./Cell";
import { Card } from "./Card";
import { TradeRow } from "./TradeRow";

const TradeDayDetails = ({ data }) => {
  const selectedDate = useCalendarStore((s) => s.selectedDate);

  const selectedDateStr = selectedDate
    ? new Date(selectedDate).toISOString().slice(0, 10)
    : null;

  const day = data.find((d) => d.date === selectedDateStr);

  if (!day) {
    return (
      <Container
        childClassName="text-(--text-muted) items-center"
        className="flex-3 min-h-70 w-full items-center"
      >
        Click a day on the calendar to view trades
      </Container>
    );
  }

  const total = day.amount;
  const charges = day.charges || 0;
  const netPnl = day.netPnl || total;
  const trades = day.trades || [];
  const wins = trades.filter((t) => t.pnl > 0).length;
  const losses = trades.filter((t) => t.pnl < 0).length;
  const winRate = ((wins / trades.length) * 100).toFixed(2);

  return (
    <Container
      className="w-full h-full flex-3 p-4! items-start !overflow-auto"
      childClassName="!overflow-auto"
    >
      <h3 className="text-sm font-semibold text-(--text-muted) mb-2">
        Trades on{" "}
        <span className="text-lg text-(--text)">
          {new Date(selectedDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </h3>

      <div className="flex flex-col space-y-6">
        <div className="flex gap-3">
          <Card
            label="Net P&L"
            value={`₹${netPnl.toFixed(2)}`}
            positive={netPnl >= 0}
          />
          <Card
            label="Gross P&L"
            value={`₹${total.toFixed(2)}`}
            positive={total >= 0}
          />
          <Card
            label="Charges"
            value={`₹${charges.toFixed(2)}`}
            positive={charges >= 0}
          />
          <Card label="Total Trades" value={trades.length} />
          <Card label="Winning Trades" value={wins} positive />
          <Card label="Losing Trades" value={losses} positive={false} />
          <Card label="Win Rate" value={`${winRate}%`} positive={true} />
        </div>

        <div className="overflow-x-auto p-3">
          <div className="w-full text-sm">
            <div className="grid grid-cols-9 border-y border-(--border-muted) sticky top-0 bg-(--surface)">
              <Cell header>Symbol</Cell>
              <Cell header>Entry</Cell>
              <Cell header>Exit</Cell>
              <Cell header>Qty</Cell>
              <Cell header>Entry Time</Cell>
              <Cell header>Exit Time</Cell>
              <Cell header>Gross P&amp;L</Cell>
              <Cell header align="right">
                Net P&amp;L
              </Cell>
              <Cell header>Charges</Cell>
            </div>

            <div className="space-y-2">
              {trades.map((t, i) => (
                <TradeRow key={i} trade={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TradeDayDetails;
