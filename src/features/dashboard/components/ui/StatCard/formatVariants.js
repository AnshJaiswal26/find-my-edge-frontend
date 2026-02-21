import {
  BarChart3,
  Calendar,
  Clock,
  Coins,
  Percent,
  Scale,
} from "lucide-react";

export const FORMAT_VARIANTS = {
  // ---------- MONEY ----------
  CURRENCY: {
    variant: "success",
    icon: Coins,
  },
  CURRENCY_SIGNED: {
    variant: "success",
    icon: Coins,
  },

  // ---------- PERCENT ----------
  PERCENT: {
    variant: "risk",
    icon: Percent,
  },
  PERCENT_SIGNED: {
    variant: "risk",
    icon: Percent,
  },

  // ---------- RATIOS ----------
  RATIO: {
    variant: "risk",
    icon: Scale,
  },
  RATIO_X: {
    variant: "risk",
    icon: Scale,
  },

  // ---------- COUNTS / MAGNITUDES ----------
  NUMBER: {
    variant: "neutral",
    icon: BarChart3, // 📊 better than Hash
  },
  NUMBER_SIGNED: {
    variant: "neutral",
    icon: BarChart3,
  },
  INTEGER: {
    variant: "neutral",
    icon: BarChart3,
  },
  COMPACT: {
    variant: "neutral",
    icon: BarChart3,
  },

  COMPACT_SIGNED: {
    variant: "success",
    icon: Coins,
  },

  // ---------- TIME ----------
  TIME: {
    variant: "neutral",
    icon: Clock,
  },

  // ---------- DATE ----------
  DATE: {
    variant: "neutral",
    icon: Calendar,
  },
};
