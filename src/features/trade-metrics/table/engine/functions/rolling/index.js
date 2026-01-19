export function runBackwardWindowReducer(reducer, fn, ctx) {
  const [expr, nExpr] = fn.args;

  const n = Math.floor(ctx.evaluate(nExpr, ctx) ?? 0);
  const state = reducer.init(n);

  if (!state) return null;

  for (let i = ctx.rowIndex; i >= 0; i--) {
    const value = ctx.evaluate(expr, {
      ...ctx,
      getValue: (key) => ctx.rows[i].cells?.[key]?.value ?? null,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    const cont = reducer.step(state, value);
    if (cont === false) break;
  }

  return reducer.result(state);
}
