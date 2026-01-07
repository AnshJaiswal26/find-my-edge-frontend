export function fnAVG_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);
  if (!nRes || nRes.valueType !== "number") return null;

  const n = Math.floor(nRes.value);
  if (n <= 0) return null;

  let sum = 0;
  let count = 0;

  for (let i = ctx.rowIndex; i >= 0 && count < n; i--) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (v && v.valueType === "number") {
      sum += v.value;
      count++;
    }
  }

  return count ? { value: sum / count, valueType: "number" } : null;
}

export function fnSUM_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);
  if (!nRes || nRes.valueType !== "number") return null;

  const n = Math.floor(nRes.value);
  if (n <= 0) return null;

  let sum = 0;
  let count = 0;

  for (let i = ctx.rowIndex; i >= 0 && count < n; i--) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (v && v.valueType === "number") {
      sum += v.value;
      count++;
    }
  }

  return { value: sum, valueType: "number" };
}

export function fnMAX_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);
  if (!nRes || nRes.valueType !== "number") return null;

  const n = Math.floor(nRes.value);
  if (n <= 0) return null;

  let max = null;
  let count = 0;

  for (let i = ctx.rowIndex; i >= 0 && count < n; i--) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (v && v.valueType === "number") {
      max = max === null ? v.value : Math.max(max, v.value);
      count++;
    }
  }

  return max === null ? null : { value: max, valueType: "number" };
}

export function fnMIN_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);
  if (!nRes || nRes.valueType !== "number") return null;

  const n = Math.floor(nRes.value);
  if (n <= 0) return null;

  let min = null;
  let count = 0;

  for (let i = ctx.rowIndex; i >= 0 && count < n; i--) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (v && v.valueType === "number") {
      min = min === null ? v.value : Math.min(min, v.value);
      count++;
    }
  }

  return min === null ? null : { value: min, valueType: "number" };
}

export function fnCOUNT_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);
  if (!nRes || nRes.valueType !== "number") return null;

  const n = Math.floor(nRes.value);
  if (n <= 0) return null;

  let count = 0;
  let seen = 0;

  for (let i = ctx.rowIndex; i >= 0 && seen < n; i--) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (v) {
      seen++;
      if (v.value) count++;
    }
  }

  return { value: count, valueType: "number" };
}

// TIER 2 — HIGH-VALUE TRADING METRICS
export function fnWIN_RATE_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);
  if (!nRes || nRes.valueType !== "number") return null;

  const n = Math.floor(nRes.value);
  if (n <= 0) return null;

  let wins = 0;
  let total = 0;

  for (let i = ctx.rowIndex; i >= 0 && total < n; i--) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (v && v.valueType === "number") {
      total++;
      if (v.value > 0) wins++;
    }
  }

  return total ? { value: wins / total, valueType: "number" } : null;
}

export function fnAVG_WIN_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);
  if (!nRes || nRes.valueType !== "number") return null;

  const n = Math.floor(nRes.value);
  if (n <= 0) return null;

  let sum = 0;
  let count = 0;
  let seen = 0;

  for (let i = ctx.rowIndex; i >= 0 && seen < n; i--) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (v && v.valueType === "number") {
      seen++;
      if (v.value > 0) {
        sum += v.value;
        count++;
      }
    }
  }

  return count ? { value: sum / count, valueType: "number" } : null;
}

export function fnAVG_LOSS_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);
  if (!nRes || nRes.valueType !== "number") return null;

  const n = Math.floor(nRes.value);
  if (n <= 0) return null;

  let sum = 0;
  let count = 0;
  let seen = 0;

  for (let i = ctx.rowIndex; i >= 0 && seen < n; i--) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (v && v.valueType === "number") {
      seen++;
      if (v.value < 0) {
        sum += v.value;
        count++;
      }
    }
  }

  return count ? { value: sum / count, valueType: "number" } : null;
}

export function fnSTDDEV_N(fn, row, ctx) {
  const [expr, nExpr] = fn.args;

  const nRes = ctx.evaluate(nExpr, row, ctx);
  if (!nRes || nRes.valueType !== "number") return null;

  const n = Math.floor(nRes.value);
  if (n <= 1) return null;

  const values = [];

  for (let i = ctx.rowIndex; i >= 0 && values.length < n; i--) {
    const v = ctx.evaluate(expr, ctx.rows[i], {
      ...ctx,
      rowIndex: i,
      prevRow: ctx.rows[i - 1],
    });

    if (v && v.valueType === "number") {
      values.push(v.value);
    }
  }

  if (values.length < 2) return null;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;

  return {
    value: Math.sqrt(variance),
    valueType: "number",
  };
}
