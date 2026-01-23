import { DEFAULT_LAYOUTS } from "../defaults";

export function buildRadarChart({ series, layout = {} }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "radar",
      category: "axis-series",
    },

    layout: {
      ...DEFAULT_LAYOUTS.radar,
      ...layout,
    },

    seriesConfig: series.map((s) => ({
      key: s.key,
      name: s.name ?? s.key,
      type: s.type ?? "number",
      tooltipLabel: s.tooltipLabel ?? s.name ?? s.key,
      color: s.color,
      prefix: s.prefix ?? "",
      suffix: s.suffix ?? "",
    })),
  };
}
