export function runNativeWindowReducer(reducer, fn, ctx) {
  const args = fn.args;

  if (!reducer?.key)
    throw new Error(
      `runNativeWindowReducer: key not found in reducer '${fn.name}'`,
    );

  // Last argument = window size
  const nExpr = args[0];
  const windowSize = Math.floor(ctx.evaluate(nExpr, ctx) ?? 0);

  const state = reducer.init(windowSize);
  if (!state) return null;

  for (let i = ctx.windowStartIndex; i >= 0; i--) {
    const value = ctx.getTradeValue(i, reducer.key);

    const cont = reducer.step(state, value);
    if (cont === false) break;
  }

  return reducer.result(state);
}
