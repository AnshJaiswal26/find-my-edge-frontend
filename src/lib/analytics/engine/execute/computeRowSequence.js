import { evaluateExpression } from "@lib/expression";
import { assertFn } from "./asserFn";
import { COMPUTATION_MODE } from "./computionModes";

export function computeRowSequence({
  schema,
  getValue,
  setValue,
  startIndex = 0,
  getTradeAt,
  getTradeCount,
  getSchemaType,
  mode,
}) {
  // console.log("computeRowSequence");
  assertFn("getTradeAt", getTradeAt);
  assertFn("getTradeCount", getTradeCount);
  assertFn("getValue", getValue);
  assertFn("setValue", setValue);

  let prevValue = schema.initialValue ?? 0;
  let prevTrade = null;

  if (mode === COMPUTATION_MODE.WINDOW && startIndex > 0) {
    prevTrade = getTradeAt(startIndex - 1);
    prevValue = getValue(prevTrade, schema.id) ?? prevValue;
  }

  const ctx = {
    evaluate: evaluateExpression,
    getTradeAt,
    getTradeCount,
    getValueFromTrade: getValue,
    getSchemaType,

    tradeIndex: 0,
    prevTrade: null,
    prevValue: null,
    currentTrade: null,

    getValue(key) {
      return getValue(this.currentTrade, key);
    },
  };

  const seqLength = getTradeCount();

  for (let i = startIndex; i < seqLength; i++) {
    const trade = getTradeAt(i);
    if (!trade) continue;

    ctx.tradeIndex = i;
    ctx.currentTrade = trade;

    if (mode === COMPUTATION_MODE.WINDOW) {
      ctx.prevTrade = prevTrade;
      ctx.prevValue = prevValue;
    }
    // console.log({ ...schema.ast });

    const value = evaluateExpression(schema.ast, ctx);
    setValue(trade, schema, value);

    if (mode === COMPUTATION_MODE.WINDOW) {
      prevValue = value;
      prevTrade = trade;
    }
  }

  return prevValue;
}
