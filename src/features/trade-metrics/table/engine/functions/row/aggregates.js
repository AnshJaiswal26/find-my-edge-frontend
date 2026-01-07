export function fnSUM(fn, row, ctx) {
  let sum = 0;

  for (const arg of fn.args) {
    const v = ctx.evaluate(arg, row, ctx);
    if (!v) continue;

    if (v.valueType !== "number") return null;

    sum += v.value;
  }

  return {
    value: sum,
    valueType: "number",
  };
}

export function fnAVG(fn, row, ctx) {
  let sum = 0;
  let count = 0;

  for (const arg of fn.args) {
    const v = ctx.evaluate(arg, row, ctx);
    if (!v) continue;

    if (v.valueType !== "number") return null;

    sum += v.value;
    count++;
  }

  return count === 0
    ? null
    : {
        value: sum / count,
        valueType: "number",
      };
}

export function fnMIN(fn, row, ctx) {
  let min = null;

  for (const arg of fn.args) {
    const v = ctx.evaluate(arg, row, ctx);
    if (!v) continue;
    if (v.valueType !== "number") return null;

    min = min === null ? v.value : Math.min(min, v.value);
  }

  return min === null ? null : { value: min, valueType: "number" };
}

export function fnMAX(fn, row, ctx) {
  let max = null;

  for (const arg of fn.args) {
    const v = ctx.evaluate(arg, row, ctx);
    if (!v) continue;
    if (v.valueType !== "number") return null;

    max = max === null ? v.value : Math.max(max, v.value);
  }

  return max === null ? null : { value: max, valueType: "number" };
}

export function fnCOALESCE(fn, row, ctx) {
  for (const arg of fn.args) {
    const v = ctx.evaluate(arg, row, ctx);
    if (v && v.value != null) return v;
  }
  return null;
}

export function fnABS(fn, row, ctx) {
  const v = ctx.evaluate(fn.args[0], row, ctx);
  if (!v || v.valueType !== "number") return null;

  return {
    value: Math.abs(v.value),
    valueType: "number",
  };
}

export function fnIF(fn, row, ctx) {
  const [condExpr, trueExpr, falseExpr] = fn.args;

  const cond = ctx.evaluate(condExpr, row, ctx);
  if (!cond || cond.valueType !== "boolean") return null;

  return cond.value
    ? ctx.evaluate(trueExpr, row, ctx)
    : ctx.evaluate(falseExpr, row, ctx);
}

export function fnCLAMP(fn, row, ctx) {
  const [valExpr, minExpr, maxExpr] = fn.args;

  const v = ctx.evaluate(valExpr, row, ctx);
  const min = ctx.evaluate(minExpr, row, ctx);
  const max = ctx.evaluate(maxExpr, row, ctx);

  if (!v || !min || !max) return null;
  if (
    v.valueType !== "number" ||
    min.valueType !== "number" ||
    max.valueType !== "number"
  )
    return null;

  return {
    value: Math.min(Math.max(v.value, min.value), max.value),
    valueType: "number",
  };
}

export function fnROUND(fn, row, ctx) {
  const [vExpr, dExpr] = fn.args;

  const v = ctx.evaluate(vExpr, row, ctx);
  const d = dExpr ? ctx.evaluate(dExpr, row, ctx) : null;

  if (!v || v.valueType !== "number") return null;

  const decimals = d && d.valueType === "number" ? Math.floor(d.value) : 0;

  const factor = Math.pow(10, decimals);

  return {
    value: Math.round(v.value * factor) / factor,
    valueType: "number",
  };
}
