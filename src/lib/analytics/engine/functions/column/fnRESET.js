export function fnRESET(fn, ctx) {
  const [valueExpr, condExpr] = fn.args;

  const shouldReset = ctx.evaluate(condExpr, ctx);

  if (shouldReset) {
    return ctx.evaluate(valueExpr, ctx);
  }

  return ctx.prevValue ?? null;
}
