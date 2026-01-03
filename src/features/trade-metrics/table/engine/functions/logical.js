export function fnIF(fn, row, ctx) {
  const [cond, yes, no] = fn.args;
  return ctx.evaluate(cond, row, ctx)
    ? ctx.evaluate(yes, row, ctx)
    : ctx.evaluate(no, row, ctx);
}
