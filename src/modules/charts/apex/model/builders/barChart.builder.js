import { DEFAULT_FORMATS } from "@shared/utils";
import { DEFAULT_LAYOUTS } from "../defaults";
import { SourceType } from "@shared/constants";

export const buildBarSeriesConfig = (s, chartId) => ({
  id: crypto.randomUUID(),
  chartId,
  field: s.field,
  name: s.name ?? s.field,
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
  const chartId = crypto.randomUUID();
  return {
    
    id: chartId,
    type: "bar",
    category,
    mode,
    source: SourceType.USER,

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

    xMetric: {
      field: x.field ?? "",
      name: x.name ?? "",
    },

    // xSeriesConfig: {
    //   key: x.key ?? "",
    //   name: x.name ?? "",
    //   type: x.type ?? "number",
    // },

    // ySeriesConfig: y.map(buildBarSeriesConfig),

    series: series ?? [],

    seriesConfig: y.map((s) => buildBarSeriesConfig(s, chartId)),
  };
}
