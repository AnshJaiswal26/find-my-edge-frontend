import { evaluateExpression } from "@lib/expression";

function assertFn(name, fn) {
  if (typeof fn !== "function") {
    throw new Error(`computeOverSequence: '${name}' must be a function`);
  }
}

export function computeOverSequence({
  schema,
  getValue,
  setValue,
  startIndex = 0,
  usePrev = false,
  useGlobal = false,
  getTradeAt,
  getTradeCount,
  getSchemaType,
}) {
  if (!schema.expression) return;

  assertFn("getTradeAt", getTradeAt);
  assertFn("getTradeCount", getTradeCount);
  assertFn("getValue", getValue);
  assertFn("setValue", setValue);

  let prevValue = schema.initialValue ?? 0;
  let prevTrade = null;

  if (usePrev && startIndex > 0) {
    prevTrade = getTradeAt(startIndex - 1);
    prevValue = getValue(prevTrade, schema.id) ?? prevValue;
  }

  // 🔹 Base evaluation context (never recreated)
  const ctx = {
    evaluate: evaluateExpression,
    getTradeAt,
    getTradeCount,
    getValueFromTrade: getValue,
    getSchemaType,

    // Mutable fields
    tradeIndex: 0,
    prevTrade: null,
    prevValue: null,
    currentTrade: null,

    getValue(key) {
      return getValue(this.currentTrade, key);
    },
  };

  if (useGlobal) {
    return evaluateExpression(schema.expression, ctx);
  }

  if (typeof getTradeCount !== "function") {
    throw new Error("computeOverSequence requires getTradeCount()");
  }

  const seqLength = getTradeCount();

  for (let i = startIndex; i < seqLength; i++) {
    const trade = getTradeAt(i);
    if (!trade) continue;

    ctx.tradeIndex = i;
    ctx.currentTrade = trade;

    if (usePrev) {
      ctx.prevTrade = prevTrade;
      ctx.prevValue = prevValue;
    }

    const value = evaluateExpression(schema.expression, ctx);

    setValue(trade, schema, value);

    if (usePrev) {
      prevValue = value;
      prevTrade = trade;
    }
  }
}
