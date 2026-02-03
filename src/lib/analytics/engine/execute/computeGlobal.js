import { evaluateExpression } from "@lib/expression";

export function computeGlobal({ tradesById, sequenceIds, schema, getValue }) {
  if (!schema.expression) return;

  const ctxBase = {
    evaluate: evaluateExpression,

    getTradeAt: (index) => {
      const id = sequenceIds[index];
      return id ? tradesById[id] : null;
    },

    getPrevTradeAt: (index) => {
      if (index <= 0) return null;
      const id = sequenceIds[index - 1];
      return id ? tradesById[id] : null;
    },

    getTradeCount: () => sequenceIds.length,

    getValueFromTrade: getValue,
  };

  for (let i = 0; i < sequenceIds.length; i++) {
    const trade = tradesById[sequenceIds[i]];

    const value = evaluateExpression(schema.expression, {
      ...ctxBase,
      tradeIndex: i,
      getValue: (key) => getValue(trade, key),
    });
  }
}
