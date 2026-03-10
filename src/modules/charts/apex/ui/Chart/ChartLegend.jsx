import { Legend } from "@shared/components/ui";
import styles from "./CustomApexChart.module.css";

function toggleSeriesKey(id, selected, cfg) {
  if (!selected) return cfg.filter((c) => c.id !== id).map((c) => c.id);

  if (selected.includes(id)) {
    const next = selected.filter((k) => k !== id);
    return next.length ? next : null;
  }

  return [...selected, id];
}

export function ChartLegend({
  type,
  show,
  alignment,
  seriesConfig,
  selectedSeriesIds,
  setSelectedSeriesIds,
}) {
  if (!show) return null;

  return (
    <div className={`${styles.legendWrapper} ${styles[alignment]}`}>
      {seriesConfig.map((s, i) => (
        <Legend
          key={i}
          color={
            type === "bar"
              ? s.colorRules.length === 0
                ? "var(--info)"
                : s.colorRules.map((r) => r.color)
              : s.color
          }
          label={s.label ?? ""}
          selected={selectedSeriesIds && !selectedSeriesIds.includes(s.id)}
          onClick={() => {
            if (seriesConfig.length === 1) return;

            const series = toggleSeriesKey(
              s.id,
              selectedSeriesIds,
              seriesConfig,
            );
            setSelectedSeriesIds(series);
          }}
        />
      ))}
    </div>
  );
}
