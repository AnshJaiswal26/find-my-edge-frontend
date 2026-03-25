import { SEMANTIC_TYPE_VALUES } from "@lib/analytics/schema";

export const COUNT = {
  args: SEMANTIC_TYPE_VALUES,
  returnType: "number",
  signature: "COUNT(expr)",
  description: "Count of non-null values",

  init: () => ({ count: 0 }),
  step: (s, v) => {
    if (v != null) s.count++;
  },
  result: (s) => s.count,
};
