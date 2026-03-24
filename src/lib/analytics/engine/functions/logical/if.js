import { SEMANTIC_TYPE_VALUES } from "@lib/analytics/schema";

export const IF = {
  signature: "IF(cond, yes, no)",
  argTypes: ["boolean", "any", "any"],
  returnType: "any",
  semantic: {
    args: ["boolean", SEMANTIC_TYPE_VALUES, 1],
    return: "same",
  },
  description: "Conditional expression",

  exec(fn, ctx) {
    const [condExpr, trueExpr, falseExpr] = fn.args;
    const expr = ctx.evaluate(condExpr, ctx) ? trueExpr : falseExpr;
    return ctx.evaluate(expr, ctx);
  },
};
