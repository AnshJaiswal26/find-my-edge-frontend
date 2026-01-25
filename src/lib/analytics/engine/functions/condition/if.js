export function fnIF(fn, ctx) {
  const [condExpr, trueExpr, falseExpr] = fn.args;
  const expr = ctx.evaluate(condExpr, ctx) ? trueExpr : falseExpr;
  return ctx.evaluate(expr, ctx);
}
