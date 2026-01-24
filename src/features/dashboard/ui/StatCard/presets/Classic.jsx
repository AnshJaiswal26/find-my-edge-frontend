export default function Classic({ stat, styles }) {
  return (
    <div
      className={`relative p-4 rounded-2xl bg-(--surface-muted)
      border border-(--border-muted) transition hover:-translate-y-1
      ${styles.glow}`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${styles.strip}`} />

      <div className="pl-3">
        <div className="text-xs uppercase opacity-60">{stat.title}</div>

        <div className={`text-3xl font-semibold ${styles.text}`}>
          {stat.value}
        </div>

        <div className="text-[10px] uppercase opacity-50">{stat.aggregate}</div>
      </div>
    </div>
  );
}
