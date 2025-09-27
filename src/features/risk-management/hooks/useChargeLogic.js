import { useCallback, useRef } from "react";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { toggleCharges, safe } from "@features/risk-management/utils";

export default function useChargesLogic() {
  const updateSections = useRiskManagementStore((s) => s.updater.sections);
  const showMsg = useRiskManagementStore((s) => s.updater.showMsg);

  const isProcessing = useRef(false);

  const charges = useCallback(
    (field) => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      const state = useRiskManagementStore.getState();
      const capital = state.capital.current;
      const ratio = state.riskReward.ratio;
      const tab = state.currentTab;

      const sections =
        tab === "normal" ? ["calculator"] : ["target", "stopLoss"];

      let targetAmt = 0,
        slAmt = 0;

      const sectionUpdates = [];
      sections.forEach((s) => {
        const section = state[s];
        const updatesArray = toggleCharges(section, field, capital, showMsg);
        if (updatesArray.length !== 0) {
          const [type, sec, updates] = updatesArray;
          const amt = updates.amount;
          if (amt !== 0) {
            if (s === "target") targetAmt = amt;
            else if (s === "stopLoss") slAmt = amt;
          }
          sectionUpdates.push(updatesArray);
        }
      });

      const isTargetOrSl = sections.length === 2;
      if (isTargetOrSl && slAmt !== 0 && targetAmt !== 0) {
        sectionUpdates.push([
          "calculator",
          "riskReward",
          { ratio: safe(targetAmt / -slAmt), prevRatio: ratio },
        ]);

        sectionUpdates.push([
          "tooltip",
          "riskReward",
          { ratio: field === "added" },
        ]);
      }

      if (sectionUpdates.length !== 0) updateSections(sectionUpdates);

      setTimeout(() => {
        isProcessing.current = false;
      }, 300);
    },
    [showMsg, updateSections]
  );

  return charges;
}
