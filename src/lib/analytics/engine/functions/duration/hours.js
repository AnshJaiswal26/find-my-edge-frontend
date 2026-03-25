export const HOURS = {
  args: ["number"],
  returnType: "duration",
  signature: "HOURS(n)",
  description: "Convert hours to duration",

  exec(fn, ctx) {
    const [value] = fn.args.map((arg) => ctx.evaluate(arg, ctx));

    if (value == null) return null;

    return value * 60 * 60;
  },
};
