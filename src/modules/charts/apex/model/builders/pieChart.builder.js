import { DEFAULT_FORMATS } from "@shared/utils";
import { DEFAULT_LAYOUTS } from "../defaults";
import { SourceType } from "@shared/constants";

export const buildDonutSeriesConfig = (s) => ({
  key: s.key,
  name: s.name ?? s.key,
  type: s.type ?? "number",
  ast: s.ast ?? null,
  formula: s.formula ?? null,
  value: s.value ?? null,
  dependencies: s.dependencies ?? [],
  label: s.label ?? s.name ?? s.key,
  color: s.color ?? "var(--info)",
});

export function buildDonutChart({ seriesConfig, groupSpec, layout = {} }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "donut",
      category: "group",
      source: SourceType.USER,
    },

    layout: {
      ...DEFAULT_LAYOUTS.pie,
      format: DEFAULT_FORMATS[seriesConfig[0].type || "number"],
      decimals: 2,
      ...layout,
    },

    groupSpec: groupSpec ?? null,

    seriesConfig: seriesConfig.map(buildDonutSeriesConfig),
  };
}
