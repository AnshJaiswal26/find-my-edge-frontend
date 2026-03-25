export const DAYS = {
  args: ["number"],
  returnType: "duration",
  signature: "DAYS(n)",
  description: "Convert days to duration",

  exec(fn, ctx) {
    const [valueExpr] = fn.args;

    const value = ctx.evaluate(valueExpr, ctx);
    if (value == null) return null;

    return value * 24 * 60 * 60;
  },
};
