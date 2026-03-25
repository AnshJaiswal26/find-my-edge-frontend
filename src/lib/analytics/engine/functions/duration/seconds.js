export const SECONDS = {
  args: ["number"],
  returnType: "duration",
  signature: "SECONDS(n)",
  description: "Convert seconds to duration",

  exec(fn, ctx) {
    const [value] = fn.args.map((arg) => ctx.evaluate(arg, ctx));

    if (value == null) return null;

    return value; // already in seconds
  },
};
