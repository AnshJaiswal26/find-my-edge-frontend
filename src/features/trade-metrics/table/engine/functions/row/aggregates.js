// --- SUM ----
export function fnSUM(fn, ctx) {
  let sum = 0;

  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, ctx);
    if (!value) continue;

    sum += value;
  }

  return sum;
}

// --- AVG ----
export function fnAVG(fn, ctx) {
  let sum = 0;
  let count = 0;

  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, ctx);
    if (!value) continue;

    sum += value;
    count++;
  }

  return count === 0 ? null : sum / count;
}

// --- MIN ----
export function fnMIN(fn, ctx) {
  let min = null;

  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, ctx);
    if (!value) continue;

    min = min === null ? value : Math.min(min, value);
  }

  return min;
}

// --- MAX ----
export function fnMAX(fn, ctx) {
  let max = null;

  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, ctx);
    if (!value) continue;

    max = max === null ? value : Math.max(max, value);
  }

  return max;
}

// --- COALESCE ----
export function fnCOALESCE(fn, ctx) {
  for (const arg of fn.args) {
    const value = ctx.evaluate(arg, ctx);
    if (value != null) return value;
  }
  return null;
}

// --- ABS ----
export function fnABS(fn, ctx) {
  const value = ctx.evaluate(fn.args[0], ctx);
  return Math.abs(value);
}

// --- IF ----
export function fnIF(fn, ctx) {
  const [condExpr, trueExpr, falseExpr] = fn.args;

  const value = ctx.evaluate(condExpr, ctx);

  return value ? ctx.evaluate(trueExpr, ctx) : ctx.evaluate(falseExpr, ctx);
}

// --- CLAMP ----
export function fnCLAMP(fn, ctx) {
  const [valExpr, minExpr, maxExpr] = fn.args;

  const value = ctx.evaluate(valExpr, ctx);
  const min = ctx.evaluate(minExpr, ctx);
  const max = ctx.evaluate(maxExpr, ctx);

  if (!value || !min || !max) return null;

  return Math.min(Math.max(value, min), max);
}

// --- ROUND ----
export function fnROUND(fn, ctx) {
  const [vExpr, dExpr] = fn.args;

  const value = ctx.evaluate(vExpr, ctx);
  const decimal = dExpr ? ctx.evaluate(dExpr, ctx) : null;

  const decimals = Math.floor(decimal);

  const factor = Math.pow(10, decimals);

  return Math.round(value * factor) / factor;
}
