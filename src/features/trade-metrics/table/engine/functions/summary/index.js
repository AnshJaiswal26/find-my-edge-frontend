export function fnTOTAL(fn, row, ctx) {
  const expr = fn.args[0];
  let total = 0;

  for (let i = 0; i <= ctx.rowIndex; i++) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (v && v.valueType === "number") {
      total += v.value;
    }
  }

  return {
    value: total,
    valueType: "number",
  };
}
