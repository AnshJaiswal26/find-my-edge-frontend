export const SECONDS = {
  argTypes: ["number"],
  returnType: "number",
  semantic: {
    args: ["number"],
    return: "duration",
  },
  signature: "SECONDS(n)",
  description: "Convert seconds to duration",

  exec(fn, ctx) {
    const [value] = fn.args.map((arg) => ctx.evaluate(arg, ctx));

    if (value == null) return null;

    return value; // already in seconds
  },
};
