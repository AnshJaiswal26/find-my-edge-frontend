import { useCallback } from "react";
import { cleanFloat, safe } from "@features/risk-management/utils";
import { useValidateAndNotify } from "..";

export default function useValidateAndSyncSection() {
  const validateAndNotify = useValidateAndNotify();

  const validateAndSyncSection = useCallback(
    (current, validation = true) => {
      const { name, field, buyPrice, sellPrice, pts, qty, rr, state } = current;

      const newBuyPrice = cleanFloat(buyPrice);

      if (validation) {
        const invalidsForCurrentSection = validateAndNotify({
          name,
          field,
          buyPrice: newBuyPrice,
          sellPrice: cleanFloat(sellPrice),
          state,
        });

        if (invalidsForCurrentSection.length !== 0 || name === "calculator")
          return [invalidsForCurrentSection];
      }

      const ratio = rr ?? state.riskReward.ratio;
      const capital = state.capital.current;

      const isTarget = name === "target";
      const oppoSec = isTarget ? "stopLoss" : "target";

      const amt = Math.abs(pts);
      const newPts = isTarget ? safe(-amt / ratio) : amt * ratio;

      const sync = {
        pts: newPts,
        buyPrice,
        sellPrice: buyPrice + newPts,
        qty,
        amount: newPts * qty,
        percent: safe((newPts * qty) / capital) * 100,
      };

      const invalidsForOppositeSection = validateAndNotify({
        name: oppoSec,
        field,
        buyPrice: newBuyPrice,
        sellPrice: cleanFloat(sync.sellPrice),
        state,
      });

      return [["calculator", oppoSec, sync], invalidsForOppositeSection];
    },
    [validateAndNotify]
  );

  return validateAndSyncSection;
}
