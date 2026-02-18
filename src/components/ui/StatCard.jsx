import { evaluateColorRules, FORMATS, formatValue } from "@utils";
import {
  IndianRupee,
  Percent,
  Calendar,
  Clock,
  BarChart3,
  Hash,
  Scale,
  Coins,
} from "lucide-react";
import { useMemo } from "react";

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

function resolveFormatGroup(format, type) {
  if (!format) return "NUMBER";

  if (type.includes("date")) {
    return "DATE";
  }

  if (type.includes("time")) {
    return "TIME";
  }

  if (FORMATS[type].some((f) => f === format)) {
    return format;
  }

  return "NUMBER";
}

const VARIANTS = {
  success: {
    bar: "bg-(--success)",
    text: "text-(--success)",
    strip: "bg-(--success)",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.18)]",
  },
  danger: {
    bar: "bg-(--error)",
    text: "text-(--error)",
    strip: "bg-(--error)",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.18)]",
  },
  risk: {
    bar: "bg-(--warning)",
    text: "text-(--warning)",
    strip: "bg-(--warning)",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.18)]",
  },
  neutral: {
    bar: "bg-(--accent)",
    text: "text-(--text)",
    strip: "bg-(--accent)",
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.18)]",
  },
};

export default function StatCard({ stat }) {
  const formatGroup = resolveFormatGroup(stat.format, stat.type);
  const ui = FORMAT_VARIANTS[formatGroup] ?? FORMAT_VARIANTS.NUMBER;

  const v = VARIANTS[ui.variant];
  const Icon = ui.icon;

  const color = useMemo(() => {
    const rule = evaluateColorRules(stat.value, stat.colorRules);
    return rule?.label === "Default" ? null : rule.color;
  }, [stat.value, stat.colorRules]);

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl
        bg-(--surface-muted)
        border border-(--border-muted)
        p-4 min-w-64
        transition-all duration-300
        hover:-translate-y-1
        hover:${v.glow}
        shadow-xl
      `}
    >
      {/* Accent strip */}
      <div
        className={`absolute left-0 top-0 h-full w-1 ${v.strip}`}
        style={{ background: color }}
      />

      {/* Content */}
      <div className="relative pl-3 flex gap-3">
        {/* Icon */}
        <div
          className={`
            mt-4 h-full w-8 rounded-lg
            flex items-center justify-center
            ${v.bar}/15
          `}
        >
          <Icon className={`h-10 w-10 ${v.text}`} style={{ color: color }} />
        </div>

        {/* Text */}
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-(--text-muted)">
            {stat.title}
          </div>

          <div
            className={`mt-1 text-3xl font-semibold ${v.text}`}
            style={{ color: color }}
          >
            {formatValue(stat.value, stat.type, {
              format: stat.format,
              decimals: 2,
            })}
          </div>

          <div className="mt-1 text-[10px] text-(--text) uppercase tracking-wide opacity-50">
            {stat.aggregate}
          </div>
        </div>
      </div>
    </div>
  );
}
