export const SELF = {
  argTypes: [],
  returnType: "any",
  signature: "SELF()",
  description: "Previous computed value of this column",

  exec(fn, ctx) {
    return ctx.prevValue ?? null;
  },
};
