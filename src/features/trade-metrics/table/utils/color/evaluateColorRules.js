import { filterOperationMap } from "@utils";

export function evaluateColorRules(value, rules = []) {
  for (const rule of rules) {
    const fn = filterOperationMap[rule.operator];
    if (!fn) continue;

    const match = fn(value, rule.value, rule?.value2);
    if (match) return rule.color;
  }

  return null;
}
