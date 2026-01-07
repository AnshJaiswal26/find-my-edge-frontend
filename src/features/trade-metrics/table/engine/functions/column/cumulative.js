export function fnPREV(fn, row, ctx) {
  const arg = fn.args[0];

  // PREV(column)
  if (arg.type === "column") {
    if (!ctx.prevRow) return null;

    const col = ctx.columnsById[arg.columnId];
    const cell = ctx.prevRow.cells[arg.columnId];

    return {
      value: cell?.value ?? null,
      valueType: col.valueType,
    };
  }

  // PREV(expr)
  return ctx.prevValue ?? null;
}

export function fnSELF(fn, row, ctx) {
  return ctx.prevValue ?? null;
}

export function fnCUM(fn, row, ctx) {
  const cur = ctx.evaluate(fn.args[0], row, ctx);
  if (!cur) return ctx.prevValue ?? null;

  // first row
  if (!ctx.prevValue) return cur;

  // type safety
  if (cur.valueType !== ctx.prevValue.valueType) return null;

  return {
    value: ctx.prevValue.value + cur.value,
    valueType: cur.valueType,
  };
}

export function fnRESET(fn, row, ctx) {
  const [valueExpr, condExpr] = fn.args;

  const cond = ctx.evaluate(condExpr, row, ctx);
  if (!cond || cond.valueType !== "boolean") return null;

  if (cond.value) {
    return ctx.evaluate(valueExpr, row, ctx);
  }

  return ctx.prevValue ?? null;
}
