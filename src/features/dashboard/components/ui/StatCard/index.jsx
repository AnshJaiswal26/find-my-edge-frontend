import { useDashboardStore } from "@features/dashboard/store";
import { resolveFormatGroup } from "./resolveFormatGroup";
import { FORMAT_VARIANTS } from "./formatVariants";
import { VARIANTS } from "./variants";
import { evaluateColorRules, formatValue } from "@shared/utils";
import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { BASE_FUNCTIONS } from "@lib/analytics/engine/functions/base";

export default function StatCard({ statId }) {
  const stat = useDashboardStore((s) => s.statsById[statId]);
  const deleteStat = useDashboardStore((s) => s.deleteStat);

  const formatGroup = resolveFormatGroup(stat.format, stat.type);
  const ui = FORMAT_VARIANTS[formatGroup] ?? FORMAT_VARIANTS.NUMBER;

  const v = VARIANTS[ui.variant];
  const Icon = ui.icon;

  const color = useMemo(() => {
    const rule = evaluateColorRules(stat.value, stat.colorRules);
    return rule?.label === "Default" ? null : rule.color;
  }, [stat.value, stat.colorRules]);

  console.log(BASE_FUNCTIONS.ABS);

  return (
    <div
      className={`
        group
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
      <Trash2
        className="group-hover:opacity-100
        group-hover:pointer-events-auto
        pointer-events-none
        opacity-0 
        absolute 
        top-2 
        right-2
        text-(--text)
        cursor-pointer
        hover:text-(--error) z-1"
        size={18}
        onClick={() => deleteStat(statId)}
      />
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
            style={{ color }}
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
