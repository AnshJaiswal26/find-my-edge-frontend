import { evaluateExpression } from "@lib/expression";

export function computePartialCumulative({
  tradesById,
  tradeOrder,
  startIndex,
  schema,
  getValue,
  setValue,
}) {
  let prevValue;
  let prevTrade;

  /* 🔹 seed state */
  if (startIndex === 0) {
    prevValue = schema.initialValue ?? 0;
    prevTrade = null;
  } else {
    const prevTradeId = tradeOrder[startIndex - 1];
    prevTrade = tradesById[prevTradeId];
    prevValue = getValue(prevTrade, schema.id) ?? schema.initialValue ?? 0;
  }

  /* 🔹 reusable trade accessors (engine-level ctx) */
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

  /* 🔹 recompute forward */
  for (let i = startIndex; i < tradeOrder.length; i++) {
    const trade = tradesById[tradeOrder[i]];

    const value = evaluateExpression(schema.expression, {
      ...ctxBase,

      tradeIndex: i,
      prevValue,
      prevTrade,

      getValue: (key) => getValue(trade, key),
    });

    setValue(trade, value);
    prevValue = value;
    prevTrade = trade;
  }
}
