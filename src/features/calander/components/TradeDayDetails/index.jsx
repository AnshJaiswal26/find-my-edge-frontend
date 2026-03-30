import { Container } from "@shared/components/layout";
import { useCalendarStore } from "../../store/uesCalendarStore";
import { Cell } from "./Cell";
import { Card } from "./Card";
import { TradeRow } from "./TradeRow";
import { useState } from "react";
import { EmptyState } from "@shared/components/ui";

export const TradeDayDetails = ({ data }) => {
  const selectedDate = useCalendarStore((s) => s.selectedDate);

  const [colWidths, setColWidths] = useState(
    Array.from({ length: 9 }).map(() => 150),
  );

  const startResize = (index, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = colWidths[index];

    const onMouseMove = (e) => {
      const newWidths = [...colWidths];
      newWidths[index] = Math.max(60, startWidth + (e.clientX - startX));
      setColWidths(newWidths);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

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
        <EmptyState text={"Click a day on the calendar to view trades"} />
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
      className="w-full h-fit flex-3 items-start !overflow-hidden"
      childClassName="w-full !overflow-auto"
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

      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-wrap gap-3 w-full">
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

        <div className="overflow-x-auto w-full border border-(--border)">
          <div className="min-w-max">
            <div className="flex border-y border-(--border-muted) sticky top-0 bg-(--surface)">
              {[
                "Symbol",
                "Entry",
                "Exit",
                "Qty",
                "Entry Time",
                "Exit Time",
                "Gross P&L",
                "Net P&L",
                "Charges",
              ].map((col, i) => (
                <div
                  key={i}
                  style={{ width: colWidths[i] }}
                  className="relative flex-none flex items-center"
                >
                  <Cell header>{col}</Cell>

                  <div
                    onMouseDown={(e) => startResize(i, e)}
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
                  />
                </div>
              ))}
            </div>

            {trades.map((t, i) => (
              <TradeRow key={i} trade={t} colWidths={colWidths} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};
