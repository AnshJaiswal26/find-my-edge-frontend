export const IF = {
  signature: "IF(cond, yes, no)",
  argTypes: ["boolean", "any", "any"],
  returnType: "any",
  semantic: {
    args: ["boolean", "any", "any"],
    return: "any",
  },
  description: "Conditional expression",

  exec(fn, ctx) {
    const [condExpr, trueExpr, falseExpr] = fn.args;
    const expr = ctx.evaluate(condExpr, ctx) ? trueExpr : falseExpr;
    return ctx.evaluate(expr, ctx);
  },
};
