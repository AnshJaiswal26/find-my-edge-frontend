import { DEFAULT_LAYOUTS } from "../defaults";

export function buildRadialBarChart({ series, layout = {} }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "radialBar",
      category: "group",
    },

    layout: {
      ...DEFAULT_LAYOUTS.radialBar,
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
