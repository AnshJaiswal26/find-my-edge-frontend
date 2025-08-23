import { useCallback } from "react";
import { useValidateAndSyncSection } from "@RM/hooks";
import { resolvePts, logResult, safe, logStart } from "@RM/utils";

export default function usePriceHandler() {
  const validateAndSyncSection = useValidateAndSyncSection();

  const handlePriceChange = useCallback(
    ({ section, field, val, state }) => {
      const { name, buyPrice, sellPrice, qty, pts } = section;
      const isBuyPrice = field === "buyPrice";
      const price = Math.max(0, val);

      const capital = state.capital.current;
      const input = state.settings.derivedInput;
      const isAmountLock = input === "amount";
      const isBLockAndSPrice = input === "buyPrice" && !isBuyPrice;
      const isSLockAndBPrice = input === "sellPrice" && isBuyPrice;

      const updated = { [field]: price };
      isBLockAndSPrice && (updated.buyPrice = price - pts);
      isSLockAndBPrice && (updated.sellPrice = price + pts);

      const shouldCompute = input === field || isAmountLock;
      if (shouldCompute) {
        const diff = isBuyPrice ? sellPrice - price : price - buyPrice;
        updated.pts = resolvePts(name, pts, diff);
        updated.amount = safe(updated.pts * qty);
        updated.percent = safe((updated.amount / capital) * 100);
      }

      const syncUpdates = validateAndSyncSection({
        name,
        field,
        buyPrice: updated.buyPrice ?? buyPrice,
        sellPrice: updated.sellPrice ?? sellPrice,
        pts,
        qty,
        state,
      });

      return [["calculator", name, updated], ...syncUpdates];
    },
    [validateAndSyncSection]
  );

  return handlePriceChange;
}
