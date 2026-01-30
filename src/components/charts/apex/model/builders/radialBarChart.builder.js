import { DEFAULT_FORMATS } from "@utils";
import { DEFAULT_LAYOUTS } from "../defaults";

export function buildRadialBarChart({ seriesConfig, layout = {} }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "radialBar",
      category: "group",
    },

    layout: {
      ...DEFAULT_LAYOUTS.radialBar,
      format: DEFAULT_FORMATS[seriesConfig[0].type || "number"],
      ...layout,
    },

    seriesConfig: seriesConfig.map((s) => ({
      key: s.key,
      name: s.name ?? s.key,
      seriesKey: s.seriesKey ?? "pnl",
      type: s.type ?? "number",
      reducer: s.reducer ?? "SUM_N",
      tooltipLabel: s.tooltipLabel ?? s.name ?? s.key,
      color: s.color ?? "var(--info)",
    })),
  };
}
