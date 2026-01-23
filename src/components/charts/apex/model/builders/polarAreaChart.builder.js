import { DEFAULT_LAYOUTS } from "../defaults";

export function buildPolarAreaChart({ series, layout = {} }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "polarArea",
      category: "axis-series",
    },

    layout: {
      ...DEFAULT_LAYOUTS.polarArea,
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
