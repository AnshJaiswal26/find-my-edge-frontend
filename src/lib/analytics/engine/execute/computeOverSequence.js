import { evaluateExpression } from "@lib/expression";

export function computeOverSequence({
  tradesById,
  sequenceIds,
  schema,
  getValue,
  setValue,
  startIndex = 0,
  usePrev = false,
}) {
  if (!schema.expression) return;

  let prevValue = schema.initialValue ?? 0;
  let prevTrade = null;

  // seed previous state only if needed
  if (usePrev && startIndex > 0) {
    const prevId = sequenceIds[startIndex - 1];
    prevTrade = tradesById[prevId];
    prevValue = getValue(prevTrade, schema.id) ?? prevValue;
  }

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

  for (let i = startIndex; i < sequenceIds.length; i++) {
    const trade = tradesById[sequenceIds[i]];

    const value = evaluateExpression(schema.expression, {
      ...ctxBase,
      tradeIndex: i,
      ...(usePrev && { prevTrade, prevValue }),
      getValue: (key) => getValue(trade, key),
    });

    setValue(trade, schema, value);

    if (usePrev) {
      prevValue = value;
      prevTrade = trade;
    }
  }
}
