export const HOURS = {
  argTypes: ["number"],
  returnType: "number",
  semantic: {
    args: ["number"],
    return: "duration",
  },
  signature: "HOURS(n)",
  description: "Convert hours to duration",

  exec(fn, ctx) {
    const [value] = fn.args.map((arg) => ctx.evaluate(arg, ctx));

    if (value == null) return null;

    return value * 60 * 60;
  },
};
