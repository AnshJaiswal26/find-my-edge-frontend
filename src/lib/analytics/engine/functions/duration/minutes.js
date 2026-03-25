export const MINUTES = {
  args: ["number"],
  returnType: "duration",
  signature: "MINUTES(n)",
  description: "Convert minutes to duration",

  exec(fn, ctx) {
    const [value] = fn.args.map((arg) => ctx.evaluate(arg, ctx));

    if (value == null) return null;

    return value * 60;
  },
};
