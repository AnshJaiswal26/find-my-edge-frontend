import React from "react";
import { StatCard } from "@ui";
import {
  InrIcon,
  HourGlassIcon,
  DiscoutIcon,
  RewardIcon,
  CandlesIcon,
  GrowthIcon,
} from "@icons/statcards";
import styles from "./StatsGrid.module.css";

const statCards = [
  { src: InrIcon, title: "Profit & Loss", value: "13.7K" },
  { src: HourGlassIcon, title: "Avg Holding Time", value: "44s" },
  { src: DiscoutIcon, title: "P&L Growth Rate", value: "25%" },
  { src: RewardIcon, title: "Avg Risk/Reward", value: "1:2" },
  { src: CandlesIcon, title: "Most Trades In", value: "Bank Nifty" },
  { src: GrowthIcon, title: "Win Rate", value: "63%" },
];

function StatCards() {
  return (
    <div className={styles.statCardGrid}>
      {statCards.map((card, i) => (
        <StatCard
          key={i}
          iconSrc={card.src}
          title={card.title}
          value={card.value}
        />
      ))}
    </div>
  );
}

export default StatCards;
