export function fnCUM(fn, ctx) {
  const value = ctx.evaluate(fn.args[0], ctx);

  if (ctx.prevValue === null || ctx.prevValue === undefined) {
    return value ?? null;
  }

  return value !== null ? ctx.prevValue + value : null;
}
