import { useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";
import "./Inputs.css";
import { useRiskManagementStore } from "../../stores";
import {
  useInputChange,
  useSpecialCaseHandler,
} from "@features/risk-management/hooks";
import { ValidationTooltip } from "@ui";
import { is, logMsg, logObj } from "@features/risk-management/utils";
import RenderLogger from "@Profiler";
import { fieldColors } from "@features/risk-management/data";
import { InfoTooltip } from "./InfoTooltip";

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
  const handleChange = useInputChange();
  const handleSpecialCases = useSpecialCaseHandler();

  const setHoveredInput = useRiskManagementStore((s) => s.updater.hoveredInput);
  const showTooltip = useRiskManagementStore((s) => s.updater.tooltip);
  const tooltip = useRiskManagementStore(
    (s) => s?.[sectionName + "Tooltip"]?.[field]
  );
  const isFlashing = useRiskManagementStore(
    (s) => s?.[sectionName + "Flash"]?.[field]
  );

  const isPyramiding = sectionName === "pyramiding";
  const currentVal = useRiskManagementStore((s) => {
    if (isPyramiding) {
      const i = s.pyramiding.layer;
      return s.pyramidingTable.rows?.[i]?.[field] || 0;
    } else {
      return s?.[sectionName]?.[field];
    }
  });

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
        handleChange(sectionName, field, val);
      }, 20),
    [handleChange]
  );

  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    setHoveredInput(`${sectionName}_${field}`);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setHoveredInput(null);
      timeoutRef.current = null;
    }, 3000);
  };

  return (
    <>
      <RenderLogger id={`NormalInput`} why={`${sectionName}.${field}`}>
        <input
          className={`risk-input ${className} ${
            tooltip ? tooltip?.type : ""
          } ${color} ${isFlashing ? "flashing" : ""}`}
          type="text"
          value={field === "ratio" ? "1 : " + currentVal : currentVal}
          onChange={(e) => {
            debouncedChange(sectionName, field, e.target.value);
          }}
          onBlur={(e) => {
            const state = useRiskManagementStore.getState();
            const section = state[sectionName];
            const inputPrev = state.inputPrev;
            handleSpecialCases(section, field, e.target.value, inputPrev);
          }}
          onMouseEnter={handleMouseEnter}
          readOnly={readOnly}
        />
      </RenderLogger>
      {tooltip && enableTooltip && (
        <RenderLogger id={`ValidationTooltip`} why={`${sectionName}.${field}`}>
          <ValidationTooltip
            type={tooltip.type ?? "error"}
            message={tooltip.message}
            position={tooltip.position}
            isVisible={true}
            autoHide={isCapital}
            onClose={() => showTooltip("capitalTooltip", { [field]: null })}
            showCloseButton={isCapital}
          />
        </RenderLogger>
      )}
      <InfoTooltip name={sectionName} field={field} />
    </>
  );
}
