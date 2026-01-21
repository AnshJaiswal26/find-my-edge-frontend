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

export function fnSELF(fn, ctx) {
  return ctx.prevValue ?? null;
}

export function fnCUM(fn, ctx) {
  const value = ctx.evaluate(fn.args[0], ctx);

  if (ctx.prevValue === null || ctx.prevValue === undefined) {
    return value ?? null;
  }

  return value !== null ? ctx.prevValue + value : null;
}

export function fnRESET(fn, ctx) {
  const [valueExpr, condExpr] = fn.args;

  const shouldReset = ctx.evaluate(condExpr, ctx);

  if (shouldReset) {
    return ctx.evaluate(valueExpr, ctx);
  }

  return ctx.prevValue ?? null;
}
