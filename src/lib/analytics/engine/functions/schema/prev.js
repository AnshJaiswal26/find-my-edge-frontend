import { NodeType } from "@lib/expression/nodeType";

export const PREV = {
  argTypes: ["any"], // expression allowed
  returnType: "any",
  signature: "PREV(expr)",
  description: "Value of expression from previous row",

  exec(fn, ctx) {
    const arg = fn.args[0];

    // PREV(key)
    if (arg.type.toUpperCase() === NodeType.IDENTIFIER) {
      if (ctx.tradeIndex === 0) return null;

      return ctx.getTradeValue
        ? ctx.getTradeValue(ctx.tradeIndex, arg.field)
        : null;
    }

    // PREV(expr)
    return ctx.prevValue ?? null;
  },
};
