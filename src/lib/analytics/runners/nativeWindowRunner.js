export function runNativeWindowReducer(reducer, fn, ctx) {
  const args = fn.args;

  // Last argument = window size
  const nExpr = args[0];
  const windowSize = Math.floor(ctx.evaluate(nExpr, ctx) ?? 0);

  const state = reducer.init(windowSize);
  if (!state) return null;

  for (let i = ctx.tradeIndex; i >= 0; i--) {
    const trade = ctx.getTradeAt(i);
    if (!trade) break;

    const cont = reducer.step(state, trade);
    if (cont === false) break;
  }

  return reducer.result(state);
}
