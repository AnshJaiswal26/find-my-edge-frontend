export function fnSUM(fn, row, ctx) {
  const expr = fn.args[0];
  let sum = 0;

  for (let i = 0; i <= ctx.rowIndex; i++) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });
    if (v != null) sum += v;
  }
  return sum;
}

export function fnAVG(fn, row, ctx) {
  const [expr, nExpr] = fn.args;
  const n = ctx.evaluate(nExpr, row, ctx);
  if (!n || n <= 0) return null;

  let sum = 0,
    count = 0;
  for (let i = ctx.rowIndex; i >= 0 && count < n; i--) {
    const v = ctx.evaluate(expr, ctx.rows[i], ctx);
    if (v != null) {
      sum += v;
      count++;
    }
  }
  return count ? sum / count : null;
}
