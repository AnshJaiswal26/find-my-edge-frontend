export const CUMSUM_RESET = {
  args: ["number", "boolean"],
  returnType: "number",
  signature: "CUMSUM_RESET(expr, condition)",
  description: "Accumulate expr but reset when condition is true",

  exec(fn, ctx) {
    const [valueExpr, condExpr] = fn.args;

    const value = ctx.evaluate(valueExpr, ctx) ?? 0;
    const shouldReset = ctx.evaluate(condExpr, ctx);

    if (shouldReset || ctx.prevValue == null) {
      return value; // start new segment
    }

    return ctx.prevValue + value; // continue accumulation
  },
};
