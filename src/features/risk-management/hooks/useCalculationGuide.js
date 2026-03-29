import { useEffect, useMemo } from "react";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { FIELDS } from "../constants";
import {
  getFormulaMap,
  getPositionSizingFormulaMap,
} from "@features/risk-management/utils";

export function useCalculationGuide(updateSettings) {
  const derivedInput = useRiskManagementStore((s) => s.settings.derivedInput);
  const selectedField = useRiskManagementStore((s) => s.settings.selectedField);
  const selectedSection = useRiskManagementStore(
    (s) => s.settings.selectedSection,
  );

  const isPositionSizing = selectedSection === "Position-Sizing";

  const isAmountLock = useMemo(() => derivedInput === "amount", [derivedInput]);
  const isBuyLock = useMemo(() => derivedInput === "buyPrice", [derivedInput]);

  const commonField = useMemo(
    () => (isBuyLock ? "buyPrice" : "sellPrice"),
    [isBuyLock],
  );

  const remainingCommonField = useMemo(
    () => (isBuyLock ? "sellPrice" : "buyPrice"),
    [isBuyLock],
  );

  const mainFields = useMemo(() => {
    if (isPositionSizing) {
      return FIELDS["positionSizing"];
    }

    return selectedSection === "Target" || selectedSection === "Stop-Loss"
      ? ["riskReward", ...FIELDS["calculator"]]
      : FIELDS["calculator"];
  }, [selectedSection, isPositionSizing]);

  const affectedMap = useMemo(() => {
    if (isPositionSizing) {
      return {
        riskAmount: ["riskPercent", "suggestedQty", "slPts"],
        riskPercent: ["riskAmount", "suggestedQty", "slPts"],
        suggestedQty: ["riskAmount", "slPts"],
        slPts: ["riskAmount", "suggestedQty"],
        lotSize: ["suggestedQty"],
      };
    }

    return {
      [commonField]: ["pts", "amount", "percent"],
      [remainingCommonField]: isAmountLock
        ? ["pts", "amount", "percent"]
        : [commonField],
      qty: isAmountLock ? ["amount", "percent"] : ["pts", derivedInput],
      pts: ["amount", "percent", commonField],
      amount: ["pts", "percent", commonField],
      percent: ["amount", "pts", commonField],
      riskReward: ["sellPrice", "pts", "amount", "percent"],
    };
  }, [
    isPositionSizing,
    commonField,
    remainingCommonField,
    isAmountLock,
    derivedInput,
  ]);

  const affected = useMemo(
    () => affectedMap[selectedField] || [],
    [affectedMap, selectedField],
  );

  const userDefined = useMemo(
    () => mainFields.filter((field) => !affected.includes(field)),
    [mainFields, affected],
  );

  const formulaMap = useMemo(() => {
    return isPositionSizing
      ? getPositionSizingFormulaMap(selectedField)
      : getFormulaMap(selectedField);
  }, [selectedField, isPositionSizing]);

  useEffect(() => {
    if (!mainFields.includes(selectedField)) {
      updateSettings({ selectedField: mainFields[2] });
    }
  }, [mainFields, selectedField]);

  return {
    affected,
    userDefined,
    selectedField,
    fields: FIELDS,
    mainFields,
    formulaMap,
    isPositionSizing,
  };
}
