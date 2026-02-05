import { evaluateExpression } from "@lib/expression";
import { assertFn } from "./asserFn";

export function computedAggregate({
  schema,
  getValue,
  getTradeAt,
  getTradeCount,
  getSchemaType,
}) {
  assertFn("getTradeAt", getTradeAt);
  assertFn("getTradeCount", getTradeCount);
  assertFn("getValue", getValue);
  assertFn("getSchemaType", getSchemaType);

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

  return evaluateExpression(schema.expression, ctx);
}
