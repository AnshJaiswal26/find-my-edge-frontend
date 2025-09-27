import { useCallback } from "react";
import {
  logInfo,
  logObj,
  logResult,
  logStart,
  logSuccess,
} from "@features/risk-management/utils";
import { useRiskManagementStore } from "@features/risk-management/stores";

export default function useSpecialCaseHandler() {
  const updateSection = useRiskManagementStore((s) => s.updater.section);

  const handleSpecialCases = useCallback(
    (section, field, val, inputPrev) => {
      const { name } = section;
      logStart("handleSpecialCases");

      const isOnlyDash = val === "-";
      const hasTrailingDot = /^-?\d+\.$/.test(val);
      const hasTrailingZeros = /\d+\.(?:0+)$/.test(val);
      const isNegSignWithDotOrZero =
        val.startsWith("-.") || val.startsWith("0-");
      const isValidNumeric = /^-?\d*\.?\d*$/.test(val);
      const isNegField =
        name === "calculator" && ["pts", "amount", "percent"].includes(field);

      const update = (newValue) => {
        logSuccess("Valid Special Case Found ", `'${val}'`);

        updateSection(name, { [field]: newValue }, { round: false });

        logResult("handleSpecialCases", true);
        return true;
      };

      if (hasTrailingDot || hasTrailingZeros || isOnlyDash)
        return update(inputPrev ?? val);

      if (isNegField && isNegSignWithDotOrZero) return update("-");

      if (!isValidNumeric) {
        logInfo("Invalid Special Case Found ", `${val}`);
        logResult("handleSpecialCases", true);
        return true;
      }

      logResult("handleSpecialCases", false);
      return false;
    },
    [updateSection]
  );

  return handleSpecialCases;
}
