export function fnCUMSUM_RESET(fn, ctx) {
  const [valueExpr, condExpr] = fn.args;

  const value = ctx.evaluate(valueExpr, ctx) ?? 0;
  const shouldReset = ctx.evaluate(condExpr, ctx);

  if (shouldReset || ctx.prevValue == null) {
    return value; // start new segment
  }

  return ctx.prevValue + value; // continue accumulation
}
