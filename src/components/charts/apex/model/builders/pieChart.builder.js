import { DEFAULT_LAYOUTS } from "../defaults";

export function buildPieChart({ series, layout = {} }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      category: "group",
    },

    layout: {
      ...DEFAULT_LAYOUTS.pie,
      ...layout,
    },

    seriesConfig: series.map((s) => ({
      key: s.key,
      name: s.name ?? s.key,
      tooltipLabel: s.tooltipLabel ?? s.name ?? s.key,
      color: s.color,
    })),
  };
}
