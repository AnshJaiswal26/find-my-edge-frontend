import { useMemo } from "react";

const Stat = ({ v, l }) => (
  <div className="flex-1 text-center">
    <p className="text-[18px] font-bold">{v}</p>
    <p className="text-[12px] text-(--text-muted)">{l}</p>
  </div>
);

const PopupSummary = ({ data, currentDate }) => {
  const stats = useMemo(() => {
    let total = 0;
    let profitDays = 0;
    let lossDays = 0;
    let totalTrades = 0;

    data.forEach((d) => {
      total += d.amount;
      totalTrades += d.trades?.length || 0;
      if (d.amount > 0) profitDays++;
      if (d.amount < 0) lossDays++;
    });

    const tradingDays = data.length;
    const avgPerDay = tradingDays ? total / tradingDays : 0;
    const winRate = tradingDays
      ? ((profitDays / tradingDays) * 100).toFixed(0)
      : 0;

    return {
      total,
      tradingDays,
      profitDays,
      lossDays,
      totalTrades,
      avgPerDay,
      winRate,
    };
  }, [data]);

  const monthLabel = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <div className="bg-(--surface) rounded-xl p-5 border border-(--border-muted)">
      <h3 className="text-sm font-medium text-(--text-muted) mb-2">
        Monthly Performance — {monthLabel} {year}
      </h3>

      <div
        className={`text-2xl font-bold mb-4 ${stats.total >= 0 ? "text-(--success)" : "text-(--error)"}`}
      >
        ₹{stats.total.toFixed(2)}
      </div>

      <div className="grid grid-cols-3 gap-y-4 border-t border-(--border-muted) pt-4">
        <Stat v={stats.tradingDays} l="Trading Days" />
        <Stat v={stats.totalTrades} l="Total Trades" />
        <Stat v={`${stats.winRate}%`} l="Win Rate" />
        <Stat v={stats.profitDays} l="Profit Days" />
        <Stat v={stats.lossDays} l="Loss Days" />
        <Stat v={`₹${stats.avgPerDay.toFixed(0)}`} l="Avg / Day" />
      </div>
    </div>
  );
};

export default PopupSummary;
