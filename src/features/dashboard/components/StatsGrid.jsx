import React from "react";
import { StatCard } from "@ui";
import { useDashboardStore } from "../store";

export const TRADE_STATS = [
  // 🟢 Performance (NUMBER)
  {
    title: "Net PnL",
    key: "net_pnl",
    type: "number",
    aggregate: "SUM_N",
    format: "CURRENCY_SIGNED",
    value: 42380,
  },
  {
    title: "Gross Profit",
    key: "gross_profit",
    type: "number",
    aggregate: "SUM_N",
    format: "CURRENCY",
    value: 91240,
  },
  {
    title: "Gross Loss",
    key: "gross_loss",
    type: "number",
    aggregate: "SUM_N",
    format: "CURRENCY_SIGNED",
    value: -48860,
  },
  {
    title: "Avg Trade PnL",
    key: "avg_trade_pnl",
    type: "number",
    aggregate: "AVG_N",
    format: "CURRENCY_SIGNED",
    value: 420,
  },

  // 🔵 Accuracy & Edge (NUMBER)
  {
    title: "Loss Rate",
    key: "loss_rate",
    type: "number",
    aggregate: "RATE",
    format: "PERCENT",
    value: 38,
  },
  {
    title: "Risk–Reward",
    key: "risk_reward",
    type: "number",
    aggregate: "RATIO",
    format: "RATIO",
    value: "1 : 2.1",
  },

  // 🟠 Risk (NUMBER)
  {
    title: "Recovery Factor",
    key: "recovery_factor",
    type: "number",
    aggregate: "FACTOR",
    format: "NUMBER",
    value: 3.1,
  },
  {
    title: "Risk / Trade",
    key: "risk_per_trade",
    type: "number",
    aggregate: "AVG_N",
    format: "PERCENT",
    value: 0.65,
  },
  {
    title: "Market Exposure",
    key: "market_exposure",
    type: "number",
    aggregate: "AVG_N",
    format: "PERCENT",
    value: 48,
  },

  // 🟣 Behavior
  {
    title: "Max Loss Streak",
    key: "max_loss_streak",
    type: "number",
    aggregate: "MAX_N",
    format: "INTEGER",
    value: 3,
  },
  {
    title: "Trade Frequency",
    key: "trade_frequency",
    type: "number",
    aggregate: "AVG_N",
    format: "NUMBER",
    value: 4.2,
  },

  // ⏱ TIME
  {
    title: "Avg Holding Time",
    key: "avg_holding_time",
    type: "time",
    aggregate: "AVG_N",
    format: "mm:ss",
    value: "18:00",
  },

  // 🧠 Advanced (NUMBER)
  {
    title: "Win Rate",
    key: "win_rate",
    type: "number",
    aggregate: "RATE",
    format: "PERCENT",
    value: 62,
    baseline: 50,
    trend: [30, 40, 45, 55, 60, 62],
  },
  {
    title: "Max Drawdown",
    key: "max_drawdown",
    type: "number",
    aggregate: "MAX_DRAWDOWN_N",
    format: "PERCENT_SIGNED",
    value: -8.2,
    baseline: 70,
    trend: [20, 25, 40, 55, 70, 82],
  },
  {
    title: "Profit Factor",
    key: "profit_factor",
    type: "number",
    aggregate: "RATIO",
    format: "RATIO_X",
    value: 1.84,
    baseline: 50,
    trend: [40, 45, 50, 58, 61],
  },
];

function StatCards() {
  const stats = useDashboardStore((s) => s.stats);
  console.log(stats);
  return (
    <div className="my-5 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} />
      ))}
    </div>
  );
}

export default StatCards;
