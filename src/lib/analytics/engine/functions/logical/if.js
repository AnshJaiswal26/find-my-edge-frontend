import { SEMANTIC_TYPE_VALUES } from "@lib/analytics/schema";

export const IF = {
  args: ["boolean", "$T", "$T"],
  generics: { $T: SEMANTIC_TYPE_VALUES },
  returnType: "$T",
  signature: "IF(cond, yes, no)",
  description: "Conditional expression",

  exec(fn, ctx) {
    const [condExpr, trueExpr, falseExpr] = fn.args;
    const expr = ctx.evaluate(condExpr, ctx) ? trueExpr : falseExpr;
    return ctx.evaluate(expr, ctx);
  },
};
