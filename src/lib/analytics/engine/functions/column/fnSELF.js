export function fnSELF(fn, ctx) {
  return ctx.prevValue ?? null;
}
