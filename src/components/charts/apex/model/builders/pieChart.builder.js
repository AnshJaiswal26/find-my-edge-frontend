import { DEFAULT_FORMATS } from "@utils";
import { DEFAULT_LAYOUTS } from "../defaults";

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

    seriesConfig: seriesConfig.map((s) => ({
      key: crypto.randomUUID(),
      name: s.name ?? s.key,
      // seriesKey: crypto.randomUUID(),
      type: s.type ?? "number",
      expression: s.expression ?? null,
      tooltipLabel: s.tooltipLabel ?? s.name ?? s.key,
      color: s.color ?? "var(--info)",
    })),
  };
}
