export default function Compact({ stat, styles }) {
  return (
    <div
      className={`p-3 rounded-xl bg-(--surface-muted)
      border border-(--border-muted) ${styles.glow}`}
    >
      <div className="text-xs opacity-60">{stat.title}</div>
      <div className={`text-xl font-semibold ${styles.text}`}>{stat.value}</div>
    </div>
  );
}
