import { formatValue, safe } from "@features/risk-management/utils";

const calculateLockFields = (amt, slPts, lotSize, mode) => {
  const suggestedQty = Math[mode](safe(amt / slPts / lotSize)) * lotSize;
  const adjustedSl = safe(amt / suggestedQty);
  return {
    suggestedQty: suggestedQty,
    adjustedSl: formatValue(adjustedSl, { mode: "Market", direction: "floor" }),
  };
};

export default function usePositionSizingHandler() {
  const handlePositionSizingChange = ({ section, field, val, state }) => {
    const { name, lotSize, slPts, riskAmount } = section;
    const capital = state.capital.current;
    const roundQtyTo = state.settings.roundQtyTo;
    const mode =
      roundQtyTo === "Nearest"
        ? "round"
        : roundQtyTo === "Up"
        ? "ceil"
        : "floor";

    const num = Math.abs(val);

    const isAmt = field === "riskAmount";
    const opposite = isAmt ? "riskPercent" : "riskAmount";

    const updated = { [field]: num };

    if (isAmt || field === "riskpercent") {
      updated[opposite] = isAmt
        ? safe(num / capital) * 100
        : safe(num / 100) * capital;
    }

    const readOnlyFields = calculateLockFields(
      updated.riskAmount ?? riskAmount,
      updated.slPts ?? slPts,
      updated.lotSize ?? lotSize,
      mode
    );

    return [["calculator", name, { ...updated, ...readOnlyFields }]];
  };

  return handlePositionSizingChange;
}
