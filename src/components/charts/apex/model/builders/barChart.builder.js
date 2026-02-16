import { DEFAULT_FORMATS } from "@utils";
import { DEFAULT_LAYOUTS } from "../defaults";

export const buildBarSeriesConfig = (s) => ({
  key: s.key,
  name: s.name ?? s.key,
  type: s.type ?? "number",
  ast: s.ast ?? null,
  colorRules: s.colorRules ?? [
    {
      operator: "always",
      value: 0,
      value2: 0,
      color: "var(--info)",
    },
  ],
});

export function buildBarChart({
  x,
  y,
  groupSpec,
  layout = {},
  category = "series",
}) {
  return {
    meta: {
      id: crypto.randomUUID(),
      type: "bar",
      category,
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
    selectedGroupIndex: groupSpec ? 0 : null,

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

    ySeriesConfig: y.map(buildBarSeriesConfig),
  };
}
