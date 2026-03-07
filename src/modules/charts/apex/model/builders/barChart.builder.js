import { DEFAULT_FORMATS } from "@shared/utils";
import { DEFAULT_LAYOUTS } from "../defaults";

export const buildBarSeriesConfig = (s) => ({
  key: s.key,
  name: s.name ?? s.key,
  type: s.type ?? "number",
  ast: s.ast ?? null,
  formula: s.formula ?? null,
  dependencies: s.dependencies ?? [],
  colorRules: s.colorRules ?? [
    {
      operator: "always",
      value: 0,
      from: 0,
      to: 0,
      color: "var(--info)",
    },
  ],
});

export function buildBarChart({
  x,
  y,
  mode = "SERIES",
  groupSpec,
  series,
  layout = {},
  category = "series",
}) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "bar",
      category,
      mode,
    },

    layout: {
      ...DEFAULT_LAYOUTS.bar,
      xFormat: DEFAULT_FORMATS[x.type || "number"],
      yFormat: DEFAULT_FORMATS[y[0].type || "number"],
      ...layout,
    },

    sort: {
      key: null,
      operator: "none",
    },

    groupSpec: groupSpec ?? null,

    filters: [],

    selection: {
      from: null,
      to: null,
    },

    series: series ?? [],

    xSeriesConfig: {
      key: x.key ?? "",
      name: x.name ?? "",
      type: x.type ?? "number",
    },

    ySeriesConfig: y.map(buildBarSeriesConfig),
  };
}
