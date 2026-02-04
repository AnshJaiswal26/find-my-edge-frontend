export function runBackwardWindowReducer(reducer, fn, ctx) {
  const args = fn.args;
  const nExpr = args[args.length - 1]; // last arg is always window size
  const n = Math.floor(ctx.evaluate(nExpr, ctx) ?? 0);

  const state = reducer.init(n);
  if (!state) return null;

  const valueExprs = args.slice(0, -1); // all other args go to reducer.step

  const rowCtx = {
    ...ctx,
    tradeIndex: 0,
    prevTrade: null,
    currentTrade: null,
    getValue(key) {
      return ctx.getValueFromTrade(this.currentTrade, key);
    },
  };

  for (let i = ctx.tradeIndex; i >= 0; i--) {
    const trade = ctx.getTradeAt(i);
    if (!trade) break;

    rowCtx.tradeIndex = i;
    rowCtx.currentTrade = trade;

    const evaluated = valueExprs.map((expr) => ctx.evaluate(expr, rowCtx));

    const cont = reducer.step(state, ...evaluated);

    if (cont === false) break;
  }

  return reducer.result(state);
}
