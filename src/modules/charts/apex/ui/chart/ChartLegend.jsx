import { Legend } from "@shared/components/ui";
import { chartEngine } from "../../model/chartEngine";
import { useEffect, useState } from "react";
import { useChartStore } from "../../store";

export function ChartLegend({
  type,
  layout,
  alignment,
  seriesOrder,
  seriesConfig,
  chartId,
}) {
  const show = layout.legend;
  if (!show) return null;

  const filterLength = useChartStore((s) => s.charts[chartId].filters?.length);
  const sort = useChartStore((s) => s.charts[chartId].sort);

  const selection = useChartStore((s) => s.charts[chartId].selection);

  const [activeSeries, setActiveSeries] = useState(new Set());

  useEffect(() => {
    if (setActiveSeries.length) {
      setActiveSeries(new Set());
    }
  }, [sort, filterLength, layout, selection]);

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
      {seriesOrder.map((id, i) => {
        const s = seriesConfig[id];
        return (
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
              chartEngine.get(chartId).highlightSeries(s.label);
            }}
            onMouseLeave={() => chartEngine.get(chartId).highlightSeries("")}
          />
        );
      })}
    </div>
  );
}
