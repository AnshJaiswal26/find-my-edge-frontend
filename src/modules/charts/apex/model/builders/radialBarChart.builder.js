import { DEFAULT_FORMATS } from "@shared/utils";
import { DEFAULT_LAYOUTS } from "../defaults";
import { SourceType } from "@shared/constants";

export const buildRadialSeriesConfig = (s) => ({
  key: s.key,
  name: s.name ?? s.key,
  type: s.type ?? "number",
  format: s.format ?? DEFAULT_FORMATS[s.type || "number"],
  decimals: s.decimals ?? 2,
  ast: s.ast ?? null,
  formula: s.formula ?? null,
  dependencies: s.dependencies ?? [],
  value: s.value ?? null,
  label: s.label ?? s.name ?? s.key,
  color: s.color ?? "var(--info)",
});

export function buildRadialBarChart({
  seriesConfig,
  series,
  groupSpec,
  layout = {},
}) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "radialBar",
      category: "group",
      source: SourceType.USER,
    },

    layout: {
      ...DEFAULT_LAYOUTS.radialBar,
      ...layout,
    },

    groupSpec: groupSpec ?? null,

    seriesConfig: seriesConfig.map(buildRadialSeriesConfig),
  };
}
