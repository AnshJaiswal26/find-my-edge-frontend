import { DEFAULT_FORMATS } from "@utils";
import { DEFAULT_LAYOUTS } from "../defaults";

export function buildLineChart({
  x,
  y,
  groups,
  layout = {},
  category = "series",
}) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "line",
      category,
    },

    layout: {
      ...DEFAULT_LAYOUTS.line,
      xFormat: DEFAULT_FORMATS[x.type || "number"],
      yFormat: DEFAULT_FORMATS[y[0].type || "number"],
      ...layout,
    },

    groups: groups ?? null,
    selectedGroupIndex: groups ? 0 : null,

    sort: {
      key: null,
      operator: "none",
    },

    filters: [],

    selection: {
      from: null,
      to: null,
    },

    xSeriesConfig: {
      key: x.key ?? "",
      name: x.name ?? "",
      type: x.type ?? "number",
    },

    ySeriesConfig: y.map((s) => ({
      key: s.key,
      name: s.name ?? s.key,
      type: s.type ?? "number",

      label: s.label ?? s.name ?? s.key,

      color: s.color ?? "var(--info)",
      markerColor: s.markerColor ?? s.color ?? "var(--info)",
      areaColor: s.areaColor ?? s.color ?? "var(--info)",
    })),
  };
}
