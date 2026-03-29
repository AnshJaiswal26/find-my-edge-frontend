import { useTradeSummary } from "../../hooks";
import { formatINR, safe } from "../../utils";

export function TransactionSummaryRow() {
  const { transactionSummaryList } = useTradeSummary();

  return (
    <div className="grid grid-cols-3 gap-2">
      {transactionSummaryList.map((item, idx) => (
        <div className="flex flex-col gap-0" key={idx}>
          <span className="text-(--text-muted)">{item.label}</span>
          <span className={item?.style}>
            {item.label === "Net P&L (%)"
              ? safe(item.value, 2) + "%"
              : formatINR(item.value || 0)}
          </span>
        </div>
      ))}
    </div>
  );
}
