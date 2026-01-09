// --- SUM ----
export function fnSUM(fn, row, ctx) {
  let sum = 0;

  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, row, ctx);
    if (!value) continue;

    sum += value;
  }

  return sum;
}

// --- AVG ----
export function fnAVG(fn, row, ctx) {
  let sum = 0;
  let count = 0;

  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, row, ctx);
    if (!value) continue;

    sum += value;
    count++;
  }

  return count === 0 ? null : sum / count;
}

// --- MIN ----
export function fnMIN(fn, row, ctx) {
  let min = null;

  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, row, ctx);
    if (!value) continue;

    min = min === null ? value : Math.min(min, value);
  }

  return min;
}

// --- MAX ----
export function fnMAX(fn, row, ctx) {
  let max = null;

  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, row, ctx);
    if (!value) continue;

    max = max === null ? value : Math.max(max, value);
  }

  return max;
}

// --- COALESCE ----
export function fnCOALESCE(fn, row, ctx) {
  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, row, ctx);
    if (value != null) return value;
  }
  return null;
}

// --- ABS ----
export function fnABS(fn, row, ctx) {
  const value = ctx.evaluate(fn.args[0], row, ctx);
  return Math.abs(value);
}

// --- IF ----
export function fnIF(fn, row, ctx) {
  const [condExpr, trueExpr, falseExpr] = fn.args;

  const value = ctx.evaluate(condExpr, row, ctx);

  return value
    ? ctx.evaluate(trueExpr, row, ctx)
    : ctx.evaluate(falseExpr, row, ctx);
}

// --- CLAMP ----
export function fnCLAMP(fn, row, ctx) {
  const [valExpr, minExpr, maxExpr] = fn.args;

  const value = ctx.evaluate(valExpr, row, ctx);
  const min = ctx.evaluate(minExpr, row, ctx);
  const max = ctx.evaluate(maxExpr, row, ctx);

  if (!value || !min || !max) return null;

  return Math.min(Math.max(value, min), max);
}

// --- ROUND ----
export function fnROUND(fn, row, ctx) {
  const [vExpr, dExpr] = fn.args;

  const value = ctx.evaluate(vExpr, row, ctx);
  const decimal = dExpr ? ctx.evaluate(dExpr, row, ctx) : null;

  const decimals = Math.floor(decimal);

  const factor = Math.pow(10, decimals);

  return Math.round(value * factor) / factor;
}
