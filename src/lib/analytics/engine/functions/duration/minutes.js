export const MINUTES = {
  argTypes: ["number"],
  returnType: "number",
  semantic: {
    args: ["number"],
    return: "duration",
  },
  signature: "MINUTES(n)",
  description: "Convert minutes to duration",

  exec(fn, ctx) {
    const [value] = fn.args.map((arg) => ctx.evaluate(arg, ctx));

    if (value == null) return null;

    return value * 60;
  },
};
