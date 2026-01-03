import { filterOperationMap } from "@utils";

export function evaluateColorRules(value, rules = []) {
  const sorted = [...rules].sort((a, b) => {
    // numeric rules → higher value first
    if (a.operator === "greaterThan" && b.operator === "greaterThan") {
      return b.value - a.value;
    }
    return 0;
  });

  for (const rule of sorted) {
    const fn = filterOperationMap[rule.operator];
    if (!fn) continue;

    if (fn(value, rule.value, rule?.value2)) {
      return rule.color;
    }
  }

  return null;
}
