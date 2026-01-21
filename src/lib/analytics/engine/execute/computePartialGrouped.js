import { evaluateExpression } from "@lib/expression";

export function computePartialGrouped({
  tradesById,
  tradeIds, // group.tradeIds
  startIndex,
  schema,
  getValue,
  setValue,
}) {
  const startValue = schema.initialValue ?? 0;

  let prevValue;
  let prevTrade;

  /* 🔹 seed state */
  if (startIndex === 0) {
    prevValue = startValue;
    prevTrade = null;
  } else {
    const prevTradeId = tradeIds[startIndex - 1];
    prevTrade = tradesById[prevTradeId];
    prevValue = getValue(prevTrade, schema.id) ?? startValue;
  }

  /* 🔹 group-scoped engine context */
  const ctxBase = {
    evaluate: evaluateExpression,

    getTradeAt: (index) => {
      const id = tradeIds[index];
      return id ? tradesById[id] : null;
    },

    getPrevTradeAt: (index) => {
      if (index <= 0) return null;
      const id = tradeIds[index - 1];
      return id ? tradesById[id] : null;
    },

    getTradeCount: () => tradeIds.length,

    getValueFromTrade: getValue,
  };

  /* 🔹 recompute forward inside group */
  for (let i = startIndex; i < tradeIds.length; i++) {
    const trade = tradesById[tradeIds[i]];

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
