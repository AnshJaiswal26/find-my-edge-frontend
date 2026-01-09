export function fnAVG_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);

  const n = Math.floor(nRes ?? 0);
  if (n <= 0) return null;

  let sum = 0;
  let count = 0;

  for (let i = ctx.rowIndex; i >= 0 && count < n; i--) {
    const value = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (value === null) continue;

    sum += value;
    count++;
  }

  return count ? sum / count : null;
}

export function fnSUM_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);

  const n = Math.floor(nRes ?? 0);
  if (n <= 0) return null;

  let sum = 0;
  let count = 0;

  for (let i = ctx.rowIndex; i >= 0 && count < n; i--) {
    const value = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (value === null) continue;

    sum += value ?? 0;
    count++;
  }

  return sum;
}

export function fnMAX_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);

  const n = Math.floor(nRes ?? 0);
  if (n <= 0) return null;

  let max = null;
  let count = 0;

  for (let i = ctx.rowIndex; i >= 0 && count < n; i--) {
    const value = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (value === null) continue;

    max = max === null ? value : Math.max(max, value);
    count++;
  }

  return max;
}

export function fnMIN_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);

  const n = Math.floor(nRes ?? 0);
  if (n <= 0) return null;

  let min = null;
  let count = 0;

  for (let i = ctx.rowIndex; i >= 0 && count < n; i--) {
    const value = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (value === null) continue;

    min = min === null ? value : Math.min(min, value);
    count++;
  }

  return min;
}

export function fnCOUNT_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);

  const n = Math.floor(nRes ?? 0);
  if (n <= 0) return null;

  let count = 0;
  let seen = 0;

  for (let i = ctx.rowIndex; i >= 0 && seen < n; i--) {
    const value = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (value === null) continue;

    seen++;
    count++;
  }

  return count;
}

// TIER 2 — HIGH-VALUE TRADING METRICS
export function fnWIN_RATE_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);

  const n = Math.floor(nRes ?? 0);
  if (n <= 0) return null;

  let wins = 0;
  let total = 0;

  for (let i = ctx.rowIndex; i >= 0 && total < n; i--) {
    const value = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (value === null) continue;

    total++;
    if (value > 0) wins++;
  }

  return total ? wins / total : null;
}

export function fnAVG_WIN_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);

  const n = Math.floor(nRes ?? 0);
  if (n <= 0) return null;

  let sum = 0;
  let count = 0;
  let seen = 0;

  for (let i = ctx.rowIndex; i >= 0 && seen < n; i--) {
    const value = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (value === null) continue;

    seen++;
    if (value > 0) {
      sum += value;
      count++;
    }
  }

  return count ? sum / count : null;
}

export function fnAVG_LOSS_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);

  const n = Math.floor(nRes ?? 0);
  if (n <= 0) return null;

  let sum = 0;
  let count = 0;
  let seen = 0;

  for (let i = ctx.rowIndex; i >= 0 && seen < n; i--) {
    const value = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (value === null) continue;

    seen++;
    if (value < 0) {
      sum += value;
      count++;
    }
  }

  return count ? sum / count : null;
}

export function fnSTDDEV_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);

  const n = Math.floor(nRes ?? 0);
  if (n <= 1) return null;

  const values = [];

  for (let i = ctx.rowIndex; i >= 0 && values.length < n; i--) {
    const value = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (value === null) continue;

    values.push(value);
  }

  if (values.length < 2) return null;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;

  return Math.sqrt(variance);
}
