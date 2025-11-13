import { Tooltip } from "@ui";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { is } from "@features/risk-management/utils";

export function InfoTooltip({ field, isHovered }) {
  const derivedInput = useRiskManagementStore((s) => s.settings.derivedInput);
  const adjustedField = useRiskManagementStore((s) => s.settings.adjustedField);

  const isReadOnly = field === "suggestedQty" || field === "adjustedSl";
  const isRiskAmtOrPercent = field === "riskPercent" || field === "riskAmount";
  const isDerived = derivedInput === field;
  const isAdjust = adjustedField === field && derivedInput === "amount";

  const getTitle = () => {
    return [
      isReadOnly ? "🔒 Read Only" : "✏️ Input",
      isDerived && "🎯 Derived Input",
      (isAdjust ||
        isDerived ||
        isReadOnly ||
        isRiskAmtOrPercent ||
        is.PAP(field)) &&
        "🔄 Auto-Calculated",
    ];
  };

  return (
    // <RenderLogger id={`Lablel-(${field})`}>
    <Tooltip
      data={getTitle()}
      isVisible={isHovered}
      position={
        is.BSQ(field) || isReadOnly || field === "lotSize" ? "top" : "bottom"
      }
    />
    // </RenderLogger>
  );
}
