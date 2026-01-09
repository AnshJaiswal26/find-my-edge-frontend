export function fnPREV(fn, row, ctx) {
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

export function fnSELF(fn, row, ctx) {
  return ctx.prevValue ?? null;
}

export function fnCUM(fn, row, ctx) {
  const value = ctx.evaluate(fn.args[0], row, ctx);

  if (ctx.prevValue === null || ctx.prevValue === undefined)
    return value ?? null;

  return value !== null ? ctx.prevValue + value : null;
}

export function fnRESET(fn, row, ctx) {
  const [valueExpr, condExpr] = fn.args;

  const value = ctx.evaluate(condExpr, row, ctx);

  if (value) {
    return ctx.evaluate(valueExpr, row, ctx);
  }

  return ctx.prevValue ?? null;
}
