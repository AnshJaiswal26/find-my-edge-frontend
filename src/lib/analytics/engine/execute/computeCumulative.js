import { evaluateExpression } from "@lib/expression";

export function computeCumulative({
  tradesById,
  tradeOrder,
  schema,
  getValue,
  setValue,
}) {
  let prevValue = schema.initialValue ?? 0;
  let prevTrade = null;

  /* 🔹 shared engine context */
  const ctxBase = {
    evaluate: evaluateExpression,

    getTradeAt: (index) => {
      const id = tradeOrder[index];
      return id ? tradesById[id] : null;
    },

    getPrevTradeAt: (index) => {
      if (index <= 0) return null;
      const id = tradeOrder[index - 1];
      return id ? tradesById[id] : null;
    },

    getTradeCount: () => tradeOrder.length,

    getValueFromTrade: getValue,
  };

  /* 🔹 full forward recompute */
  for (let tradeIndex = 0; tradeIndex < tradeOrder.length; tradeIndex++) {
    const trade = tradesById[tradeOrder[tradeIndex]];

    const value = evaluateExpression(schema.expression, {
      ...ctxBase,

      tradeIndex,
      prevValue,
      prevTrade,

      getValue: (key) => getValue(trade, key),
    });

    setValue(trade, value);
    prevValue = value;
    prevTrade = trade;
  }
}
