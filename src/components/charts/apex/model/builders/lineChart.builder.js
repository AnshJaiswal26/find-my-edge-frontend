import { DEFAULT_LAYOUTS } from "../defaults";

export function buildLineChart({ x, y, layout = {}, category = "series" }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "line",
      category,
    },

    layout: {
      ...DEFAULT_LAYOUTS.line,
      ...layout,
    },

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

      color: s.color,
      markerColor: s.markerColor ?? s.color,
      areaColor: s.areaColor ?? s.color,
    })),
  };
}
