export function MetricTableHeader() {
  return (
    <div
      className="
        grid grid-cols-5 gap-3
        px-3 py-2
        text-[11px] font-semibold
        uppercase tracking-wide
        text-(--muted)
        border-b border-(--border)
      "
    >
      <span>Metric</span>
      <span className="text-right">Sum</span>
      <span className="text-right">Avg</span>
      <span className="text-right">Min</span>
      <span className="text-right">Max</span>
    </div>
  );
}
