import { DEFAULT_LAYOUTS } from "../defaults";

export function buildDonutChart({ seriesConfig, series, layout = {} }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "donut",
      category: "group",
    },

    layout: {
      ...DEFAULT_LAYOUTS.pie,
      ...layout,
    },

    series: series ?? [],

    seriesConfig: seriesConfig.map((s) => ({
      key: s.key,
      name: s.name ?? s.key,
      type: s.type ?? "number",
      tooltipLabel: s.tooltipLabel ?? s.name ?? s.key,
      color: s.color,
    })),
  };
}
