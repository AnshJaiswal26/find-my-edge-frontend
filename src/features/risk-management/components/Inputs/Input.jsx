import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import "./Inputs.css";
import { useRiskManagementStore } from "@features/risk-management/stores";

import { ValidationTooltip } from "@ui";
import {
  checkSpecialCase,
  handleChange,
  is,
} from "@features/risk-management/utils";
import { fieldColors } from "@features/risk-management/data";

export default function Input({
  className,
  label,
  sectionName,
  field,
  enableTooltip = true,
  readOnly = false,
}) {
  return (
    <>
      <div className="relative">
        <div className="risk-label">
          <span className="text-1xl">
            {`${
              field === "suggestedQty" || field === "adjustedSl" ? "🔒" : ""
            }`}
          </span>
          <span>{label}</span>
        </div>
        <NormalInput
          className={className}
          sectionName={sectionName}
          field={field}
          enableTooltip={enableTooltip}
          readOnly={readOnly}
        />
      </div>
    </>
  );
}

function NormalInput({
  className,
  sectionName,
  field,
  enableTooltip,
  readOnly,
}) {
  const firstRun = useRef(true);

  const [flash, setFlash] = useState(false);

  const showTooltip = useRiskManagementStore((s) => s.updater.tooltip);

  const tooltip = useRiskManagementStore(
    (s) => s?.[sectionName + "Tooltip"]?.[field]
  );

  const derivedInput = useRiskManagementStore((s) => s.settings.derivedInput);
  const adjustedField = useRiskManagementStore((s) => s.settings.adjustedField);

  const isReadOnly = field === "suggestedQty" || field === "adjustedSl";
  const isRiskAmtOrPercent = field === "riskPercent" || field === "riskAmount";
  const isDerived = derivedInput === field;
  const isAdjust = adjustedField === field && derivedInput === "amount";

  const tooltipContent = [
    isReadOnly ? "🔒 Read Only" : "✏️ Input",
    isDerived && "🎯 Derived Input",
    (isAdjust ||
      isDerived ||
      isReadOnly ||
      isRiskAmtOrPercent ||
      is.PAP(field)) &&
      "🔄 Auto-Calculated",
  ]
    .filter(Boolean)
    .join("\n");

  const isPyramiding = sectionName === "pyramiding";
  const currentVal = useRiskManagementStore((s) => {
    if (isPyramiding) {
      const i = s.pyramiding.layer;
      return s.pyramidingTable.rows?.[i]?.[field] || 0;
    } else {
      return s?.[sectionName]?.[field];
    }
  });

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setFlash(true);
    setTimeout(() => setFlash(false), 100);
  }, [currentVal]);

  const isCapital = sectionName === "capital";

  const color = is.PAP(field)
    ? currentVal < 0
      ? "text-[#fe5a5a]"
      : currentVal > 0
      ? "text-[#05ab72]"
      : "text-[#5d5d5d] dark:text-white"
    : fieldColors[field];

  const debouncedChange = useMemo(
    () =>
      debounce((sectionName, field, val) => {
        handleChange(
          sectionName,
          field,
          val,
          useRiskManagementStore.getState()
        );
      }, 20),
    [handleChange]
  );

  return (
    <>
      <div data-tooltip={tooltipContent} data-tooltip-position="top">
        <input
          className={`risk-input ${className} ${
            tooltip ? tooltip?.type : ""
          } ${color} ${flash ? "flashing" : ""}`}
          type="text"
          value={field === "ratio" ? "1 : " + currentVal : currentVal}
          onChange={(e) => {
            debouncedChange(sectionName, field, e.target.value);
          }}
          onBlur={(e) => {
            const state = useRiskManagementStore.getState();
            const { caseValue } = checkSpecialCase(
              sectionName,
              field,
              e.target.value,
              state.inputPrev
            );
            if (caseValue !== null)
              state.updater.section(
                sectionName,
                { [field]: caseValue },
                { round: false }
              );
          }}
          readOnly={readOnly}
        />
      </div>
      {tooltip && enableTooltip && (
        <ValidationTooltip
          type={tooltip.type ?? "error"}
          message={tooltip.message}
          position={tooltip.position}
          isVisible={true}
          autoHide={isCapital}
          onClose={() => showTooltip("capitalTooltip", { [field]: null })}
          showCloseButton={isCapital}
        />
      )}
    </>
  );
}
