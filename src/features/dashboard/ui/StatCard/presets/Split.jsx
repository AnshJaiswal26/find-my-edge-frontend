import { formatValue } from "@utils";

export default function Split({ stat, styles }) {
  return (
    <div
      className={`
        relative flex items-center justify-between
        rounded-2xl p-4 min-w-64
        bg-(--surface-muted)
        border border-(--border-muted)
        transition hover:-translate-y-1
        ${styles.glow}
      `}
    >
      {/* Left strip */}
      <div className={`absolute left-0 top-0 h-full w-1 ${styles.strip}`} />

      {/* Left: label */}
      <div className="pl-3">
        <div className="text-xs uppercase tracking-wide opacity-60">
          {stat.title}
        </div>

        <div className="mt-1 text-[10px] uppercase opacity-50">
          {stat.aggregate}
        </div>
      </div>

      {/* Right: value */}
      <div className={`text-3xl font-semibold ${styles.text}`}>
        {formatValue(stat.value, stat.type, {
          format: stat.format,
          decimals: 2,
        })}
      </div>
    </div>
  );
}
