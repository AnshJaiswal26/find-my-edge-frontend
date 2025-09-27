import { useCallback } from "react";
import { useValidateAndSyncSection } from "@features/risk-management/hooks";

export default function useRiskRewardHandler() {
  const validateAndSyncSection = useValidateAndSyncSection();
  const handleRiskRewardChange = useCallback(
    ({ val, state }) => {
      const { buyPrice, pts, qty } = state.stopLoss;
      const newRiskReward = Math.max(0, val);

      const syncUpdates = validateAndSyncSection(
        {
          name: "stopLoss",
          field: "pts",
          buyPrice,
          pts,
          qty,
          rr: newRiskReward,
          state,
        },
        false
      );

      return [
        ["calculator", "riskReward", { ratio: newRiskReward }],
        ...syncUpdates,
      ];
    },
    [validateAndSyncSection]
  );
  return handleRiskRewardChange;
}
