export function runGlobalReducer(reducer, fn, ctx) {
  const [expr] = fn.args;

  const state = reducer.init();
  if (!state) return null;

  const total = ctx.getTradeCount?.();
  if (total == null) return null;

  // Reusable evaluation context
  const rowCtx = {
    ...ctx,
    tradeIndex: 0,
    currentTrade: null,

    getValue(key) {
      return ctx.getValueFromTrade(this.currentTrade, key);
    },
  };

  for (let i = 0; i < total; i++) {
    const trade = ctx.getTradeAt(i);
    if (!trade) continue;

    rowCtx.tradeIndex = i;
    rowCtx.currentTrade = trade;

    const value = ctx.evaluate(expr, rowCtx);

    const cont = reducer.step(state, value);
    if (cont === false) break;
  }

  return reducer.result(state);
}
