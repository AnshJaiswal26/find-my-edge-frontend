import { useTradeSummary } from "../../hooks";
import { formatINR } from "../../utils";

export function ChargesSummaryList() {
  const { chargesSummaryList } = useTradeSummary();

  return chargesSummaryList.map((item, idx) => (
    <div className="flex justify-between items-center" key={idx}>
      <span className="text-(--text-muted)">{item.label}</span>
      <span className="text-(--text-muted)">
        {typeof item.value === "number"
          ? formatINR(item.value || 0)
          : item.value}
      </span>
    </div>
  ));
}
