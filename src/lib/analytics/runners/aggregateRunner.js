export function runAggregateReducer(reducer, fn, ctx) {
  const args = fn.args;

  const state = reducer.init();
  if (!state) return null;

  const total = ctx.getTradeCount?.();

  if (total == null) return null;

  for (let i = 0; i < total; i++) {
    ctx.tradeIndex = i;

    const evaluated = args.map((expr) => ctx.evaluate(expr, ctx));

    reducer.step(state, ...evaluated);
  }

  return reducer.result(state);
}
