import { evaluateExpression } from "@lib/expression";

export function computeRow({
  tradesById,
  tradeOrder,
  schema,
  getValue,
  setValue,
}) {
  if (!schema.expression) return;

  for (let i = 0; i < tradeOrder.length; i++) {
    const trade = tradesById[tradeOrder[i]];

    const value = evaluateExpression(schema.expression, {
      evaluate: evaluateExpression,
      getValue: (key) => getValue(trade, key),
      tradeIndex: i,
    });

    setValue(trade, value);
  }
}
