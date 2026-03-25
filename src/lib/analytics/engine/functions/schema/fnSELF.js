export const SELF = {
  args: [],
  returnType: "$T",
  signature: "SELF()",
  description: "Previous computed value of this column",

  exec(fn, ctx) {
    return ctx.prevValue ?? null;
  },
};
