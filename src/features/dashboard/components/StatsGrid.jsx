import React from "react";
import { StatCard } from "@ui";

export const TRADE_STATS = [
  // 🟢 Performance
  {
    title: "Net PnL",
    value: "+₹42,380",
    delta: "+12.4%",
    variant: "success",
  },
  {
    title: "Gross Profit",
    value: "₹91,240",
    percent: 78,
    minLabel: "Loss",
    maxLabel: "Profit",
    variant: "success",
  },
  {
    title: "Gross Loss",
    value: "-₹48,860",
    percent: 42,
    minLabel: "0",
    maxLabel: "Max",
    variant: "danger",
  },
  {
    title: "Avg Trade PnL",
    value: "+₹420",
    percent: 64,
    variant: "success",
  },
  // {
  //   key: "expectancy",
  //   title: "Expectancy",
  //   value: "+0.38R",
  //   percent: 61,
  //   variant: "neutral",
  // },

  // 🔵 Accuracy & Edge
  {
    title: "Loss Rate",
    value: "38%",
    percent: 38,
    variant: "danger",
  },
  {
    title: "Risk–Reward",
    value: "1 : 2.1",
    percent: 70,
    variant: "neutral",
  },
  // {
  //   key: "edge",
  //   title: "Edge",
  //   value: "8.6%",
  //   percent: 68,
  //   variant: "success",
  // },

  // 🟠 Risk & Drawdown

  // {
  //   key: "avgDD",
  //   title: "Avg Drawdown",
  //   value: "-2.1%",
  //   percent: 45,
  //   variant: "risk",
  // },
  {
    title: "Recovery Factor",
    value: "3.1",
    percent: 72,
    variant: "success",
  },
  {
    title: "Risk / Trade",
    value: "0.65%",
    percent: 65,
    variant: "risk",
  },
  {
    title: "Market Exposure",
    value: "48%",
    percent: 48,
    variant: "neutral",
  },

  // 🟣 Consistency & Behavior
  // {
  //   key: "maxWinStreak",
  //   title: "Max Win Streak",
  //   value: "7 trades",
  //   percent: 70,
  //   variant: "success",
  // },
  {
    title: "Max Loss Streak",
    value: "3 trades",
    percent: 30,
    variant: "danger",
  },
  {
    title: "Trade Frequency",
    value: "4.2 / day",
    percent: 60,
    variant: "neutral",
  },
  {
    title: "Avg Holding Time",
    value: "18 min",
    percent: 55,
    variant: "neutral",
  },
  // {
  //   key: "volatility",
  //   title: "Return Volatility",
  //   value: "1.9%",
  //   percent: 58,
  //   variant: "risk",
  // },
  {
    title: "Win Rate",
    value: "62%",
    percent: 62,
    baseline: 50,
    trend: [30, 40, 45, 55, 60, 62],
    variant: "success",
  },
  {
    title: "Max Drawdown",
    value: "-8.2%",
    percent: 82,
    baseline: 70,
    trend: [20, 25, 40, 55, 70, 82],
    variant: "danger",
  },
  {
    title: "Profit Factor",
    value: "1.84",
    percent: 61,
    baseline: 50,
    trend: [40, 45, 50, 58, 61],
    variant: "neutral",
  },
];

function StatCards() {
  return (
    // <div className={styles.statCardGrid}>
    //   {statCards.map((card, i) => (
    //     <StatCard
    //       key={i}
    //       iconSrc={card.src}
    //       title={card.title}
    //       value={card.value}
    //     />
    //   ))}
    // </div>
    <div className="my-5 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      {TRADE_STATS.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

export default StatCards;
