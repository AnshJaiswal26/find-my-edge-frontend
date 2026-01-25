export function runBackwardWindowReducer(reducer, fn, ctx) {
  const [expr, nExpr] = fn.args;

  const n = Math.floor(ctx.evaluate(nExpr, ctx) ?? 0);
  const state = reducer.init(n);
  if (!state) return null;

  for (let i = ctx.tradeIndex; i >= 0; i--) {
    const trade = ctx.getTradeAt(i);
    if (!trade) break;

    const value = ctx.evaluate(expr, {
      ...ctx,
      evaluate: ctx.evaluate,
      tradeIndex: i,
      prevTrade: ctx.getPrevTradeAt(i),
      getValue: (key) => ctx.getValueFromTrade(trade, key),
    });

    const cont = reducer.step(state, value);
    if (cont === false) break;
  }

  return reducer.result(state);
}
