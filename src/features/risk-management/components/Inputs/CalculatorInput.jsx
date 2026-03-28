import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useRiskManagementStore } from "@features/risk-management/stores";

import { Input, ValidationTooltip } from "@shared/components/ui";
import { handleChange } from "@features/risk-management/utils";
import { FIELD_COLORS } from "../../constants";
import { LockKeyholeIcon } from "lucide-react";
import { hideTooltip, showTooltip } from "@shared/components/ui/tooltip";

export function CalculatorInput({
  className,
  label,
  sectionName,
  field,
  enableTooltip = true,
  readOnly = false,
}) {
  const firstRun = useRef(true);

  const [flash, setFlash] = useState(false);

  const triggerTooltip = useRiskManagementStore((s) => s.updater.tooltip);

  const tooltip = useRiskManagementStore(
    (s) => s?.[sectionName + "Tooltip"]?.[field],
  );

  const derivedInput = useRiskManagementStore((s) => s.settings.derivedInput);
  const adjustedField = useRiskManagementStore((s) => s.settings.adjustedField);

  const isReadOnly = field === "suggestedQty" || field === "adjustedSl";
  const isRiskAmtOrPercent = field === "riskPercent" || field === "riskAmount";
  const isDerived = derivedInput === field;
  const isAdjust = adjustedField === field && derivedInput === "amount";
  const isPtsOrAmountOrPercent =
    field === "pts" || field === "amount" || field === "percent";

  const tooltipContent = [
    isReadOnly ? "🔒 Read Only" : "✏️ Input",
    isDerived && "🎯 Derived Input",
    (isAdjust ||
      isDerived ||
      isReadOnly ||
      isRiskAmtOrPercent ||
      isPtsOrAmountOrPercent) &&
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

  const color = isPtsOrAmountOrPercent
    ? currentVal < 0
      ? "var(--error)"
      : currentVal > 0
        ? "var(--success)"
        : "var(--text)"
    : FIELD_COLORS[field];

  const debouncedChange = debounce((sectionName, field, val) => {
    handleChange(sectionName, field, val, useRiskManagementStore.getState());
  }, 20);

  useEffect(() => {
    if (tooltip && enableTooltip) {
      hideTooltip();
    }
  }, [enableTooltip, tooltip]);

  return (
    <>
      <Input
        vertical
        onMouseEnter={(e) =>
          showTooltip(e, {
            content: tooltipContent,
          })
        }
        onMouseLeave={hideTooltip}
        style={{ border: flash ? "1px solid var(--info)" : "", color: color }}
        label={
          <div className="flex gap-1 items-center">
            {label}
            {(field === "suggestedQty" || field === "adjustedSl") && (
              <LockKeyholeIcon size={14} />
            )}
          </div>
        }
        // classNames={{
        //   input: `risk-input ${className} ${
        //     tooltip ? tooltip?.type : ""
        //   } ${color}`,
        // }}
        type="number"
        value={field === "ratio" ? "1 : " + currentVal : currentVal}
        onChange={(v) => {
          debouncedChange(sectionName, field, v);
        }}
        readOnly={readOnly}
      />
      {tooltip && enableTooltip && (
        <ValidationTooltip
          type={tooltip.type ?? "error"}
          message={tooltip.message}
          position={tooltip.position}
          isVisible={true}
          autoHide={isCapital}
          onClose={() => triggerTooltip("capitalTooltip", { [field]: null })}
          showCloseButton={isCapital}
        />
      )}
    </>
  );
}
