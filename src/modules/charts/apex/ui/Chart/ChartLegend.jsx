import { Legend } from "@shared/components/ui";
import { chartEngine } from "../../model/chartEngine";
import { useState } from "react";

export function ChartLegend({ type, show, alignment, seriesConfig, chartId }) {
  if (!show) return null;

  const [activeSeries, setActiveSeries] = useState(new Set());

  const toggleSeriesState = (id) => {
    setActiveSeries((prev) => {
      const next = new Set(prev);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  };

  const alignmentClass = {
    left: "justify-start",
    right: "justify-end",
    center: "justify-center",
  }[alignment];

  return (
    <div className={`flex relative gap-1 flex-wrap w-full ${alignmentClass}`}>
      {seriesConfig.map((s, i) => (
        <Legend
          key={s.id ?? i}
          color={
            type === "bar"
              ? s.colorRules.length === 0
                ? "var(--info)"
                : s.colorRules.map((r) => r.color)
              : s.color
          }
          label={s.label ?? ""}
          selected={!activeSeries.has(s.id)}
          onClick={() => {
            chartEngine.get(chartId).toggleSeries(s.label);
            toggleSeriesState(s.id);
          }}
          onMouseEnter={() => {
            if (activeSeries.has(s.id)) return;
            chartEngine.get(chartId).highlightSeries(s.label);
          }}
          onMouseLeave={() => chartEngine.get(chartId).highlightSeries("")}
        />
      ))}
    </div>
  );
}
