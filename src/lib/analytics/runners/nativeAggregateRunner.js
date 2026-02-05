export function runNativeAggregateReducer(reducer, fn, ctx) {
  const state = reducer.init();
  if (!state) return null;

  const total = ctx.getTradeCount?.();
  if (total == null) return null;

  for (let i = 0; i < total; i++) {
    const trade = ctx.getTradeAt(i);
    if (!trade) continue;

    const cont = reducer.step(state, trade);
    if (cont === false) break;
  }

  return reducer.result(state);
}
