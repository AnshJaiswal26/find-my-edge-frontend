import { evaluateExpression } from "@lib/expression";
import { assertFn } from "./asserFn";

export function computeAggregate({
  ast,
  getTradeValue,
  getTradeCount,
  getSchemaType,
}) {
  assertFn("getTradeCount", getTradeCount);
  assertFn("getTradeValue", getTradeValue);
  assertFn("getSchemaType", getSchemaType);

  const ctx = {
    evaluate: evaluateExpression,
    getTradeCount,
    getTradeValue,
    getSchemaType,

    tradeIndex: 0,

    getKeyValue(field) {
      return getTradeValue(this.tradeIndex, field);
    },
  };

  return evaluateExpression(ast, ctx);
}
