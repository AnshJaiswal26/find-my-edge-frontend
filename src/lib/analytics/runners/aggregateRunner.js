export function runAggregateReducer(reducer, fn, ctx) {
  const args = fn.args;

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

    const evaluated = args.map((expr) => ctx.evaluate(expr, rowCtx));

    reducer.step(state, ...evaluated);
  }

  return reducer.result(state);
}
