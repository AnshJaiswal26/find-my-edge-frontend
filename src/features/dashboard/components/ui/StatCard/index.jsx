import { useDashboardStore } from "@features/dashboard/store";
import { resolveFormatGroup } from "./resolveFormatGroup";
import { FORMAT_VARIANTS } from "./formatVariants";
import { VARIANTS } from "./variants";
import { evaluateColorRules, formatValue, parseColor } from "@shared/utils";
import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

export default function StatCard({ statId }) {
  const stat = useDashboardStore((s) => s.statsById[statId]);
  const deleteStat = useDashboardStore((s) => s.deleteStat);
  const [hovered, setHovered] = useState(false);

  const formatGroup = resolveFormatGroup(stat.format, stat.type);
  const ui = FORMAT_VARIANTS[formatGroup] ?? FORMAT_VARIANTS.NUMBER;
  const v = VARIANTS[ui.variant] ?? VARIANTS.neutral;
  const Icon = ui.icon;

  const accentColor = useMemo(() => {
    const rule = evaluateColorRules(stat.value, stat.colorRules);
    return rule?.label === "Default" || !rule
      ? v.rawColor
      : parseColor(rule.color);
  }, [stat.value, stat.colorRules, v.rawColor]);

  return (
    <div
      style={{
        border: `1px solid ${hovered ? accentColor : "var(--surface-muted)"}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-xl border border-(--border-muted) bg-(--surface-muted) p-4 min-w-[210px] w-full cursor-default select-none transition-all duration-200 ease-out hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.08)] shadow-lg h-full"
    >
      <div className="grid-item-drag invisible group-hover:visible absolute cursor-move bg-inherit text-(--text) p-1 text-xs top-0 left-1/2 rotate-90 box-border">
        ⠿
      </div>
      {/* Top accent hairline */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl opacity-90"
        style={{ background: accentColor }}
      />

      {/* Subtle inner top sheen */}
      {/* <div className="absolute top-0 left-0 right-0 h-16 rounded-t-xl opacity-[0.03] bg-gradient-to-b from-white to-transparent pointer-events-none" /> */}

      {/* Delete btn — fades in on hover */}
      <button
        onClick={() => deleteStat(statId)}
        className="absolute top-2.5 right-2.5 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 text-(--text-muted) hover:text-(--error) hover:bg-(--error)/10 cursor-pointer"
      >
        <Trash2 size={12} />
      </button>

      {/* ── Header: icon pill + label ── */}
      <div className="flex items-center gap-2 mb-3 pr-5">
        <div
          className="flex items-center justify-center w-[26px] h-[26px] rounded-[7px] flex-shrink-0 border"
          style={{
            background: `${accentColor}14`,
            borderColor: `${accentColor}28`,
          }}
        >
          <Icon size={12} style={{ color: accentColor }} />
        </div>
        <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-(--text-muted) truncate leading-none">
          {stat.title}
        </span>
      </div>

      {/* ── Value ── */}
      <div
        className="text-[27px] font-semibold tracking-[-0.04em] leading-none text-(--text) tabular-nums"
        style={{ color: accentColor }}
      >
        {formatValue(stat.value, stat.type, {
          format: stat.format,
          decimals: 2,
        })}
      </div>

      {/* ── Divider ── */}
      <div className="mt-3 mb-2.5 h-px bg-(--border-muted) opacity-60" />

      {/* ── Footer ── */}
      <div className="flex items-end justify-between gap-2">
        {/* Left: aggregate + format badge */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-[11px] text-(--text-muted) font-normal leading-none truncate">
            {stat.aggregate}
          </span>
          <div className="flex items-center gap-1.5">
            <div
              className="w-[5px] h-[5px] rounded-full flex-shrink-0"
              style={{ background: accentColor, opacity: 0.75 }}
            />
            <span
              className="text-[9px] uppercase tracking-[0.08em] font-medium"
              style={{ color: accentColor, opacity: 0.6 }}
            >
              {stat.format ?? stat.type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
