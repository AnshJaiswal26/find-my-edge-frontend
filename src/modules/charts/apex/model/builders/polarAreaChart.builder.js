import { SourceType } from "@shared/constants";
import { DEFAULT_LAYOUTS } from "../defaults";

export const buildPolarSeriesConfig = (s) => ({
  key: s.key,
  name: s.name ?? s.key,
  type: s.type ?? "number",
  label: s.label ?? s.name ?? s.key,
  color: s.color,
  prefix: s.prefix ?? "",
  suffix: s.suffix ?? "",
});

export function buildPolarAreaChart({ series, layout = {} }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "polarArea",
      category: "axis-series",
      source: SourceType.USER,
    },

    layout: {
      ...DEFAULT_LAYOUTS.polarArea,
      ...layout,
    },

    seriesConfig: series.map(buildPolarSeriesConfig),
  };
}
