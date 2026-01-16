export function fnPREV(fn, ctx) {
  const arg = fn.args[0];

  // PREV(column)
  if (arg.type === "column") {
    if (!ctx.prevRow) return null;

    const cell = ctx.prevRow.cells[arg.columnId];

    return cell?.value ?? null;
  }

  // PREV(expr)
  return ctx.prevValue ?? null;
}

export function fnSELF(fn, ctx) {
  return ctx.prevValue ?? null;
}

export function fnCUM(fn, ctx) {
  const value = ctx.evaluate(fn.args[0], ctx);

  if (ctx.prevValue === null || ctx.prevValue === undefined)
    return value ?? null;

  return value !== null ? ctx.prevValue + value : null;
}

export function fnRESET(fn, ctx) {
  const [valueExpr, condExpr] = fn.args;

  const value = ctx.evaluate(condExpr, ctx);

  if (value) {
    return ctx.evaluate(valueExpr, ctx);
  }

  return ctx.prevValue ?? null;
}
