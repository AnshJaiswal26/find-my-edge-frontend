import { Legend } from "@layout";
import styles from "./CustomApexChart.module.css";

function toggleSeriesKey(key, selected, cfg) {
  if (!selected) return cfg.filter((c) => c.key !== key).map((c) => c.key);

  if (selected.includes(key)) {
    const next = selected.filter((k) => k !== key);
    return next.length ? next : null;
  }

  return [...selected, key];
}

export function ChartLegend({
  type,
  show,
  alignment,
  seriesConfig,
  selectedSeriesKeys,
  setSelectedSeriesKeys,
}) {
  if (!show) return null;

  return (
    <div className={`${styles.legendWrapper} ${styles[alignment]}`}>
      {seriesConfig.map((s, i) => (
        <Legend
          key={i}
          color={type === "bar" ? s.colorRules.map((r) => r.color) : s.color}
          label={s.name ?? s.label}
          selected={selectedSeriesKeys && !selectedSeriesKeys.includes(s.key)}
          onClick={() => {
            if (seriesConfig.length === 1) return;

            const series = toggleSeriesKey(
              s.key,
              selectedSeriesKeys,
              seriesConfig,
            );
            setSelectedSeriesKeys(series);
          }}
        />
      ))}
    </div>
  );
}
