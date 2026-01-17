import { DEFAULT_LAYOUTS } from "../defaults";

export function buildRadialBarChart({ seriesConfig, series, layout = {} }) {
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
    series: series ?? [],

    seriesConfig: seriesConfig.map((s) => ({
      key: s.key,
      name: s.name ?? s.key,
      tooltipLabel: s.tooltipLabel ?? s.name ?? s.key,
      color: s.color,
    })),
  };
}
