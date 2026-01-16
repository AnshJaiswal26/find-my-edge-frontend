import { DEFAULT_LAYOUTS } from "../defaults";

export function buildBarChart({ x, y, layout = {}, category = "series" }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "bar",
      xaxisMetric: x,
      category,
    },

    layout: {
      ...DEFAULT_LAYOUTS.bar,
      ...layout,
    },

    sort: {
      key: null,
      operator: "none",
    },

    filters: [],

    filteredOrder: [],
    sortedOrder: [],

    xSeriesConfig: {
      key: x,
      name: x,
    },

    seriesConfig: y.map((s) => ({
      key: s.key,
      name: s.name ?? s.key,
      colors: s.colors ?? [],
    })),
  };
}
