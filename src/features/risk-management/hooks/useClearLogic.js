import { useRef } from "react";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { resetAllToZero } from "@features/risk-management/utils";
import { FIELDS } from "../constants";

const resetAllTooltips = (tooltips) => {
  return Object.entries(tooltips).reduce((acc, [key, val]) => {
    if (val !== null) acc[key] = null;
    return acc;
  }, {});
};

export function useClearLogic() {
  const clearTimers = useRef({});
  const updateSections = useRiskManagementStore((s) => s.updater.sections);

  return (secName) => {
    if (clearTimers.current[secName]) return;
    const isTargetOrSL = secName === "target" || secName === "stopLoss";
    const oppositeSec = secName === "target" ? "stopLoss" : "target";

    const tooltipKey = secName + "Tooltip";
    const oppoTooltipKey = oppositeSec + "Tooltip";

    const state = useRiskManagementStore.getState();
    const sectionTooltips = state[tooltipKey];
    const isAnyActive = state.anyTooltipActive;

    const keysReset = resetAllToZero(FIELDS[secName]);

    const updates = [];
    if (isTargetOrSL) {
      updates.push(["calculator", "riskReward", { ratio: 0 }]);
      updates.push(["calculator", oppositeSec, keysReset]);
      isAnyActive &&
        updates.push([
          "tooltip",
          oppoTooltipKey,
          resetAllTooltips(state[oppoTooltipKey]),
        ]);
    }

    updates.push(["calculator", secName, keysReset]);
    isAnyActive && updates.push(["tooltip", tooltipKey, sectionTooltips]);

    updateSections(updates);

    clearTimers.current[secName] = setTimeout(() => {
      delete clearTimers.current[secName];
    }, 1000);
  };
}
