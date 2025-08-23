import { useCallback } from "react";
import { useValidateAndSyncSection } from "@RM/hooks";
import { getValBySecName, logObj, safe } from "@RM/utils";

export default function usePtsAmountAndPercentHandler() {
  const validateAndSync = useValidateAndSyncSection();

  const handlePtsAmountAndPercentChange = useCallback(
    ({ section, field, val, state, isFormatting = false }) => {
      const { name, buyPrice, sellPrice, qty } = section;
      const value = getValBySecName(name, val);

      const capital = state.capital.current;
      const { derivedInput, adjustedField } = state.settings;
      const isAmountLock = derivedInput === "amount";
      const isBuyLock =
        derivedInput === "buyPrice" ||
        (adjustedField === "buyPrice" && isAmountLock);

      const isPts = field === "pts";

      const newAmount = isPts
        ? value * qty
        : field === "amount"
        ? value
        : capital * safe(value / 100);
      const newPts = isPts ? value : safe(newAmount / qty);
      const newPercent = safe(newAmount / capital) * 100;

      const newBuyPrice = isBuyLock ? sellPrice - newPts : buyPrice;
      const newSellPrice = !isBuyLock ? buyPrice + newPts : sellPrice;

      const syncUpdates = !isFormatting
        ? validateAndSync({
            name,
            field,
            buyPrice: newBuyPrice,
            sellPrice: newSellPrice,
            pts: newPts,
            qty,
            state,
          })
        : [];

      return [
        [
          "calculator",
          name,
          {
            buyPrice: newBuyPrice,
            sellPrice: newSellPrice,
            pts: newPts,
            amount: newAmount,
            percent: newPercent,
          },
        ],
        ...syncUpdates,
      ];
    },
    [validateAndSync]
  );

  return handlePtsAmountAndPercentChange;
}
