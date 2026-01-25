export function fnPREV(fn, ctx) {
  const arg = fn.args[0];

  // PREV(key)
  if (arg.type === "key") {
    if (!ctx.prevTrade) return null;

    return ctx.getValueFromTrade
      ? ctx.getValueFromTrade(ctx.prevTrade, arg.columnId)
      : null;
  }

  // PREV(expr)
  return ctx.prevValue ?? null;
}
