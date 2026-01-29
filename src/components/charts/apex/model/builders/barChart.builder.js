import { DEFAULT_LAYOUTS } from "../defaults";

export function buildBarChart({ x, y, layout = {}, category = "series" }) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "bar",
      category,
      xSeriesType: "",
      ySeriesType: "",
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
      colorRules: s.colorRules ?? [
        {
          operator: "always",
          value: 0,
          value2: 0,
          color: "var(--info)",
        },
      ],
    })),
  };
}
