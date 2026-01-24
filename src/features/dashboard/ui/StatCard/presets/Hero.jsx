export default function Hero({ stat, styles }) {
  return (
    <div
      className={`relative p-6 rounded-3xl bg-(--surface-muted)
      border border-(--border-muted) ${styles.glow}`}
    >
      <div className={`absolute inset-0 opacity-10 ${styles.strip}`} />

      <div className={`text-5xl font-bold ${styles.text}`}>{stat.value}</div>

      <div className="mt-1 text-xs uppercase opacity-60">{stat.title}</div>
    </div>
  );
}
