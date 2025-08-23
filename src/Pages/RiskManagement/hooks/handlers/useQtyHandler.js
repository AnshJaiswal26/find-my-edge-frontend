import { useValidateAndSyncSection } from "@RM/hooks";
import { safe } from "@RM/utils";
import { useCallback } from "react";

export default function useQtyHandler() {
  const validateAndSyncSection = useValidateAndSyncSection();

  const handleQtyChange = useCallback(
    ({ section, field, val, state }) => {
      const { name, buyPrice, sellPrice, pts, amount } = section;
      const newQty = Math.abs(parseInt(val));

      const capital = state.capital.current;
      const derivedInput = state.settings.derivedInput;
      const isAmountLock = derivedInput === "amount";
      const isBuyLock = derivedInput === "buyPrice";

      const updated = { qty: newQty };

      if (isAmountLock) {
        updated.amount = pts * newQty;
        updated.percent = safe(updated.amount / capital) * 100;
      } else {
        updated.pts = safe(amount / newQty);
        if (isBuyLock) updated.buyPrice = sellPrice - updated.pts;
        else updated.sellPrice = buyPrice + updated.pts;
      }

      const syncUpdates = validateAndSyncSection({
        name,
        field,
        buyPrice: updated.buyPrice ?? buyPrice,
        sellPrice: updated.sellPrice ?? sellPrice,
        pts,
        qty: newQty,
        state,
      });

      return [["calculator", name, updated], ...syncUpdates];
    },
    [validateAndSyncSection]
  );
  return handleQtyChange;
}
