import { useCallback } from "react";
import { useRiskManagementStore } from "@features/risk-management/stores";
import {
  useFieldHandler,
  useSpecialCaseHandler,
} from "@features/risk-management/hooks";
import {
  generateTooltip,
  logInfo,
  logResult,
  logStart,
} from "@features/risk-management/utils";

const checkValues = (field, val) => {
  let Max_Val = 100 * 10000000,
    isValid;
  if (field === "pts" || field === "percent") isValid = val <= 10000;
  else if (field === "amount" || field === "capital") isValid = val <= Max_Val;
  else if (field === "ratio") isValid = val <= 100;
  else val <= 100000;
};

export default function useInputChange() {
  const handleSpecialCases = useSpecialCaseHandler();
  const handlers = useFieldHandler();

  const updateSections = useRiskManagementStore((s) => s.updater.sections);
  const showTooltip = useRiskManagementStore((s) => s.updater.tooltip);

  const handleChange = useCallback(
    (sectionName, field, val) => {
      const state = useRiskManagementStore.getState();
      const capital = state.capital.current;
      const section = state[sectionName];

      logStart("handleInputChange", { section, field, val });

      const value = field === "ratio" ? val.replace("1 : ", "") : val;
      field === "ratio" && logInfo("Processed value for ratio", value);

      const isSpecialCaseFound = handleSpecialCases(section, field, value);

      if (isSpecialCaseFound) {
        logResult("handleInputChange", "Special Case Found.");
        return;
      }

      const prev = section[field];
      const num = value === "" ? 0 : Number(value);

      if (prev === num) {
        logResult("handleInputChange", "No Change Found - skipping update.");
        return;
      }

      if ((capital === 0 && field === "percent") || field === "riskPercent") {
        const tooltip = generateTooltip(field, "zeroCapital");
        showTooltip("capitalTooltip", { current: tooltip });
        logResult("handleInputChange", "Capital is Zero");
        return;
      }

      const updates = handlers[field]({ section, field, val: num, state });

      if (updates) {
        updates.push(["single-value", "inputPrev", num]);
        updateSections(updates);
      }

      logResult("handleInputChange", `Process Done for ${section.name}.`);
    },
    [handlers, handleSpecialCases, updateSections, showTooltip]
  );

  return handleChange;
}
