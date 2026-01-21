import { computePartialCumulative } from "./computePartialCumulative";
import { computePartialGrouped } from "./computePartialGrouped";
import { evaluateExpression } from "@lib/expression";

export const PARTIAL_RUNNERS = {
  row: ({ tradesById, tradeId, schema, getValue, setValue }) => {
    const trade = tradesById[tradeId];
    if (!trade || !schema.expression) return;

    const ctxBase = {
      evaluate: evaluateExpression,

      // minimal ordered access (safe even if unused)
      getTradeAt: () => null,
      getPrevTradeAt: () => null,
      getTradeCount: () => 1,

      getValueFromTrade: getValue,
    };

    const value = evaluateExpression(schema.expression, {
      ...ctxBase,
      tradeIndex: 0,
      getValue: (key) => getValue(trade, key),
    });

    setValue(trade, value);
  },

  cumulative: computePartialCumulative,

  grouped: computePartialGrouped,
};
