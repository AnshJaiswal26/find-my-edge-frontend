import { Container, Section } from "@layout";

const Row = ({ label, value, positive, selectedDate }) => (
  <div className="flex justify-between items-center text-sm">
    <span>{label}</span>
    <span
      className={`font-semibold ${
        positive == null
          ? "text-(--text)"
          : positive
            ? "text-(--success)"
            : "text-(--error)"
      }`}
    >
      {value}
    </span>
  </div>
);

const TradeDayDetails = ({ data, selectedDate }) => {
  const day = data.find((d) => d.date === selectedDate);

  if (!day) {
    return (
      <Container childClassName="text-(--text-muted)">
        Click a day on the calendar to view trades
      </Container>
    );
  }

  const total = day.amount;
  const trades = day.trades || [];
  const wins = trades.filter((t) => t.pnl > 0).length;
  const losses = trades.filter((t) => t.pnl < 0).length;

  return (
    <Container className="w-[60%]">
      <h3 className="text-sm font-semibold text-(--text-muted) mb-3 flex-4">
        Trades on {selectedDate}
      </h3>

      <div className="flex flex-col space-y-3">
        <Section className={"!w-full"}>
          <Row
            label="Net P&L"
            value={`₹${total.toFixed(2)}`}
            positive={total >= 0}
          />
          <Row label="Total Trades" value={trades.length} />
          <Row label="Winning Trades" value={wins} positive />
          <Row label="Losing Trades" value={losses} positive={false} />
        </Section>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-(--text-muted) border-b border-(--border-muted)">
              <tr>
                <th className="text-left py-2">Symbol</th>
                <th className="text-left py-2">Entry</th>
                <th className="text-left py-2">Exit</th>
                <th className="text-left py-2">Qty</th>
                <th className="text-left py-2">Entry Time</th>
                <th className="text-left py-2">Exit Time</th>
                <th className="text-right py-2">P&L</th>
              </tr>
            </thead>
            <tbody>
              {day.trades.map((t) => (
                <tr
                  key={t.tradeId}
                  className="border-b border-(--border-muted)/50"
                >
                  <td className="py-2">{t.symbol}</td>
                  <td>{t.entry}</td>
                  <td>{t.exit}</td>
                  <td>{t.qty}</td>
                  <td>{t.entryTime}</td>
                  <td>{t.exitTime}</td>
                  <td
                    className={`text-right font-semibold ${
                      t.pnl >= 0 ? "text-(--success)" : "text-(--error)"
                    }`}
                  >
                    ₹{Number(t.pnl).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

export default TradeDayDetails;
