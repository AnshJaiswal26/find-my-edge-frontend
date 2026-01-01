export function MetricStatsRow({ metric, id }) {
  const className = `text-right text-(--text)`;

  return (
    <div
      className="
        grid grid-cols-5 gap-3
        px-3 py-2
        rounded-md
        border border-(--border)
        bg-(--surface-muted)
        text-sm
        font-medium
      "
    >
      <span>{metric.label}</span>

      <span className={className}>{metric.sum}</span>

      <span className={className}>{metric.avg}</span>
      <span className={className}>{metric.min}</span>
      <span className={className}>{metric.max}</span>
    </div>
  );
}
