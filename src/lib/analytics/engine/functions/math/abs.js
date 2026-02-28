export const ABS = {
  argTypes: ["number"],
  returnType: "number",
  semantic: { args: ["number"], return: "number" },
  signature: "ABS(expr)",
  description: "Absolute value",

  exec(fn, ctx) {
    const [expr] = fn.args;

    const value = ctx.evaluate(expr, ctx);
    if (value == null) return null;

    return Math.abs(value);
  },
};
