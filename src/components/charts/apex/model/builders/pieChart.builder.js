import { DEFAULT_FORMATS } from "@utils";
import { DEFAULT_LAYOUTS } from "../defaults";

export const buildDonutSeriesConfig = (s) => ({
  key: s.key,
  name: s.name ?? s.key,
  type: s.type ?? "number",
  expression: s.expression ?? null,
  tooltipLabel: s.tooltipLabel ?? s.name ?? s.key,
  color: s.color ?? "var(--info)",
});

export function buildDonutChart({ seriesConfig, groupSpec, layout = {} }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "donut",
      category: "group",
    },

    layout: {
      ...DEFAULT_LAYOUTS.pie,
      format: DEFAULT_FORMATS[seriesConfig[0].type || "number"],
      decimals: 2,
      ...layout,
    },

    groupSpec: groupSpec ?? null,

    seriesConfig:
      groupSpec && groupSpec.ast
        ? []
        : seriesConfig.map(buildDonutSeriesConfig),
  };
}
