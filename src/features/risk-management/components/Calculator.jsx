import { useRiskManagementStore } from "../stores";
import { useMemo } from "react";
import { debounce } from "lodash";
import { CalculatorSectionLayout } from "../layout";
import { ResetInputsButton } from "./ResetInputsButton";

export function Calculator({ sectionName }) {
  const updateTransaction = useRiskManagementStore(
    (s) => s.updater.transaction,
  );

  const debouncedHoveredSection = useMemo(() => {
    return debounce((name) => {
      updateTransaction(name);
    }, 100);
  }, [updateTransaction]);

  const isTargetOrSL = sectionName !== "calculator";

  return (
    <CalculatorSectionLayout
      section={sectionName}
      onMouseEnter={debouncedHoveredSection}
      footerElement={
        !isTargetOrSL && <ResetInputsButton sectionName={sectionName} />
      }
    />
  );
}
