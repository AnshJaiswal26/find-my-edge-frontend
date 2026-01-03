export function fnSUM(fn, row, ctx) {
  return fn.args.reduce((acc, arg) => {
    const v = ctx.evaluate(arg, row, ctx);
    return v == null ? acc : acc + v;
  }, 0);
}

export function fnAVG(fn, row, ctx) {
  let sum = 0;
  let count = 0;

  fn.args.forEach((arg) => {
    const v = ctx.evaluate(arg, row, ctx);
    if (v != null) {
      sum += v;
      count++;
    }
  });

  return count === 0 ? null : sum / count;
}

export const fnMIN = (fn, row, ctx) =>
  Math.min(...fn.args.map((a) => ctx.evaluate(a, row, ctx)));

export const fnMAX = (fn, row, ctx) =>
  Math.max(...fn.args.map((a) => ctx.evaluate(a, row, ctx)));

export const fnABS = (fn, row, ctx) =>
  Math.abs(ctx.evaluate(fn.args[0], row, ctx));

export const fnROUND = (fn, row, ctx) => {
  const v = ctx.evaluate(fn.args[0], row, ctx);
  const d = fn.args[1]?.value ?? 0;
  return Number(v.toFixed(d));
};

export const fnFLOOR = (fn, row, ctx) =>
  Math.floor(ctx.evaluate(fn.args[0], row, ctx));

export const fnCEIL = (fn, row, ctx) =>
  Math.ceil(ctx.evaluate(fn.args[0], row, ctx));
