import { useRef } from "react";
import { useRiskManagementStore } from "@RM/stores";
import { is, resetAllToZero } from "@RM/utils";
import { fields } from "@RM/data";

const resetAllTooltips = (tooltips) => {
  return Object.entries(tooltips).reduce((acc, [key, val]) => {
    if (val !== null) acc[key] = null;
    return acc;
  }, {});
};

export default function useClearLogic() {
  const clearTimers = useRef({});
  const updateSections = useRiskManagementStore((s) => s.updater.sections);

  const clearSection = (secName) => {
    if (clearTimers.current[secName]) return;
    const isTargetOrSL = is.TOrSl(secName);
    const oppositeSec = is.oSL(secName);

    const tooltipKey = secName + "Tooltip";
    const oppoTooltipkey = oppositeSec + "Tooltip";

    const state = useRiskManagementStore.getState();
    const sectionTooltips = state[tooltipKey];
    const isAnyActive = state.anyTooltipActive;

    const keysReset = resetAllToZero(fields[secName]);

    const updates = [];
    if (isTargetOrSL) {
      updates.push(["calculator", "riskReward", { ratio: 0 }]);
      updates.push(["calculator", oppositeSec, keysReset]);
      isAnyActive &&
        updates.push([
          "tooltip",
          oppoTooltipkey,
          resetAllTooltips(state[oppoTooltipkey]),
        ]);
    }

    updates.push(["calculator", secName, keysReset]);
    isAnyActive && updates.push(["tooltip", tooltipKey, sectionTooltips]);

    updateSections(updates);

    clearTimers.current[secName] = setTimeout(() => {
      delete clearTimers.current[secName];
    }, 1000);
  };

  return clearSection;
}
