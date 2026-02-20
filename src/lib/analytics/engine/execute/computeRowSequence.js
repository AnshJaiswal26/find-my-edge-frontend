import { evaluateExpression } from "@lib/expression";
import { assertFn } from "./asserFn";
import { COMPUTATION_MODE } from "./computionModes";

export function computeRowSequence({
  ast,
  schemaKey,
  startIndex = 0,
  initialValue = 0,
  setTradeValue,
  getTradeValue,
  getTradeCount,
  getSchemaType,
  mode,
}) {
  assertFn("getTradeCount", getTradeCount);
  assertFn("getTradeValue", getTradeValue);
  assertFn("setTradeValue", setTradeValue);
  assertFn("getSchemaType", getSchemaType);

  assertFn("setTradeValue", setTradeValue);
  assertFn("getTradeValue", getTradeValue);

  const ctx = {
    evaluate: evaluateExpression,
    getTradeCount,
    getSchemaType,

    tradeIndex: 0,
    windowStartIndex: startIndex,
    prevValue: initialValue,
    startIndex,

    getKeyValue(key) {
      return getTradeValue(this.tradeIndex, key);
    },
  };
  const isWindow = mode === COMPUTATION_MODE.WINDOW;

  if (isWindow && startIndex > 0) {
    ctx.prevValue = getTradeValue(startIndex - 1, schemaKey) ?? initialValue;
  }

  const seqLength = getTradeCount();

  for (let i = startIndex; i < seqLength; i++) {
    ctx.tradeIndex = i;
    ctx.windowStartIndex = i; // for window

    const value = evaluateExpression(ast, ctx);
    setTradeValue(i, schemaKey, value);

    if (isWindow) ctx.prevValue = value;
  }

  return ctx.prevValue;
}
