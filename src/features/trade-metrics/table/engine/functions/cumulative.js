export function fnPREV(fn, row, ctx) {
  const arg = fn.args[0];

  if (arg.type === "column") {
    return ctx.prevRow?.cells[arg.columnId]?.value ?? null;
  }
  return ctx.prevValue ?? null;
}

export function fnSELF(fn, row, ctx) {
  return ctx.prevValue ?? null;
}

export function fnCUM(fn, row, ctx) {
  const v = ctx.evaluate(fn.args[0], row, ctx);
  if (v == null) return ctx.prevValue ?? null;
  return (ctx.prevValue ?? 0) + v;
}

export function fnRESET(fn, row, ctx) {
  const [valueExpr, condExpr] = fn.args;
  const cond = ctx.evaluate(condExpr, row, ctx);
  console.log(cond, ctx.evaluate(valueExpr, row, ctx));
  if (cond) return ctx.evaluate(valueExpr, row, ctx);
  return ctx.prevValue ?? null;
}
