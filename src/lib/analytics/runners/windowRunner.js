export function runWindowReducer(reducer, fn, ctx) {
  const args = fn.args;
  const nExpr = args[args.length - 1]; // last arg is always window size
  const n = Math.floor(ctx.evaluate(nExpr, ctx) ?? 0);

  const state = reducer.init(n);
  if (!state) return null;

  const valueExprs = args.slice(0, -1); // all other args go to reducer.step

  for (let i = ctx.windowStartIndex; i >= 0; i--) {
    ctx.tradeIndex = i;

    const evaluated = valueExprs.map((expr) => ctx.evaluate(expr, ctx));

    const cont = reducer.step(state, ...evaluated);

    if (cont === false) break;
  }

  return reducer.result(state);
}
