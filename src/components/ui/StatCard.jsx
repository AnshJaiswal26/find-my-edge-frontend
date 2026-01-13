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

export default function StatCard({
  title,
  value,
  percent,
  minLabel,
  maxLabel,
  delta,
  variant = "neutral",
  baseline = 50, // analytical marker
  trend = [], // [0–100] sparkline values
}) {
  const v = VARIANTS[variant];

  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl
        bg-(--surface)
        border border-(--border-muted)
        p-4 min-w-64
        transition-all duration-300
        hover:-translate-y-1
        hover:${v.glow}
        shadow-xl
      `}
    >
      {/* Accent strip */}
      <div className={`absolute left-0 top-0 h-full w-1 ${v.strip}`} />

      {/* Gradient wash */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent)] pointer-events-none" />

      {/* Content */}
      <div className="relative pl-3">
        <div className="text-xs uppercase tracking-wide text-(--text-muted)">
          {title}
        </div>

        <div className={`mt-2 text-3xl font-semibold ${v.text}`}>{value}</div>

        {/* Bar */}
        {percent != null && (
          <div className="mt-3 relative">
            {/* Zones */}
            <div className="absolute inset-0 flex">
              <div className="w-1/3 bg-(--danger)/20" />
              <div className="w-1/3 bg-(--warning)/20" />
              <div className="w-1/3 bg-(--success)/20" />
            </div>

            {/* Bar container */}
            <div className="relative h-2 rounded bg-(--hover) overflow-hidden">
              <div
                className={`h-full ${v.bar}`}
                style={{ width: `${percent}%` }}
              />

              {/* Baseline marker */}
              <div
                className="absolute top-0 h-full w-[2px] bg-white/70"
                style={{ left: `${baseline}%` }}
              />
            </div>

            {(minLabel || maxLabel) && (
              <div className="mt-1 flex justify-between text-[10px] opacity-60">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
              </div>
            )}
          </div>
        )}

        {/* Trend spark */}
        {trend.length > 0 && (
          <div className="mt-3 flex gap-[2px] h-6 items-end">
            {trend.map((v, i) => (
              <div
                key={i}
                className={`${VARIANTS[variant].bar} opacity-60`}
                style={{ height: `${Math.max(10, v)}%`, width: 3 }}
              />
            ))}
          </div>
        )}

        {/* Delta */}
        {delta && (
          <div
            className={`mt-2 text-xs ${
              delta.startsWith("-") ? "text-(--danger)" : "text-(--success)"
            }`}
          >
            {delta} vs last period
          </div>
        )}
      </div>
    </div>
  );
}
