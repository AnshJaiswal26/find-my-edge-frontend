export function runBaseReducer(reducer, fn, ctx, extraArgs = []) {
  const state = reducer.init();

  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, ctx);
    reducer.step(state, value, ...extraArgs);
  }

  return reducer.result(state);
}
