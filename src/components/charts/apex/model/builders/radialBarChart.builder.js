import { DEFAULT_FORMATS } from "@utils";
import { DEFAULT_LAYOUTS } from "../defaults";

export const buildRadialSeriesConfig = (s) => ({
  key: s.key,
  name: s.name ?? s.key,
  type: s.type ?? "number",
  format: s.format ?? DEFAULT_FORMATS[s.type || "number"],
  decimals: s.decimals ?? 2,
  ast: s.ast ?? null,
  label: s.label ?? s.name ?? s.key,
  color: s.color ?? "var(--info)",
});

export function buildRadialBarChart({ seriesConfig, groupSpec, layout = {} }) {
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

    groupSpec: groupSpec ?? null,

    seriesConfig: seriesConfig.map(buildRadialSeriesConfig),
  };
}
