import { useRiskManagementStore } from "@features/risk-management/stores";
import { SECTION_COLOR, SECTION_LABELS } from "../../constants";
import { useTradeSummary } from "@features/risk-management/hooks";
import { formatINR, safe } from "@features/risk-management/utils";
import { Section } from "@shared/components/layout";

export default function TransactionSummarySection() {
  return (
    <Section className="px-4">
      <TransactionSummaryTitle />
      <TransactionSummaryRow />
    </Section>
  );
}

function TransactionSummaryTitle() {
  const transaction = useRiskManagementStore((s) => s.currentTransaction);

  return (
    <span className="text-lg">
      Transaction Summary For{" "}
      <span className={SECTION_COLOR[transaction]}>
        {SECTION_LABELS[transaction]}
      </span>
    </span>
  );
}

function TransactionSummaryRow() {
  const { transactionSummaryList } = useTradeSummary();

  return (
    <div className="transaction-summary-row">
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
