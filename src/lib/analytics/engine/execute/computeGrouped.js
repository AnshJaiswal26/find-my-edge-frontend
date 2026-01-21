import { evaluateExpression } from "@lib/expression";

export function computeGrouped({
  tradesById,
  groups,
  schema,
  getValue,
  setValue,
}) {
  if (!groups || !groups.length) return;
  if (!schema.expression) return;

  for (const group of groups) {
    let prevValue = schema.initialValue ?? 0;
    let prevTrade = null;

    const tradeIds = group.rowIds;

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

    for (let index = 0; index < tradeIds.length; index++) {
      const trade = tradesById[tradeIds[index]];

      const value = evaluateExpression(schema.expression, {
        ...ctxBase,

        tradeIndex: index,
        prevValue,
        prevTrade,

        getValue: (key) => getValue(trade, key),
      });

      setValue(trade, value);
      prevValue = value;
      prevTrade = trade;
    }
  }
}
