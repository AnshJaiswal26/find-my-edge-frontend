import { SummaryCard } from "./SummaryCard";

export function KpiGrid({ summary }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <SummaryCard
        label="Total P&L"
        value={summary.totalPnl}
        accent={summary.totalPnl >= 0 ? "success" : "danger"}
      />
      <SummaryCard
        label="Win Rate"
        value={`${summary.winRate}%`}
        accent="info"
      />
      <SummaryCard label="Trades" value={summary.tradeCount} />
    </div>
  );
}
