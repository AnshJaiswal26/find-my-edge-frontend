import { useRiskManagementStore } from "@features/risk-management/stores";
import { sectionColor, sectionLabels } from "@features/risk-management/data";
import { useTradeSummary } from "@features/risk-management/hooks";
import { formatINR, safe } from "@features/risk-management/utils";
import { Section } from "@shared/components/layout";

export default function TransactionSummarySection() {
  return (
    <Section>
      <TransactionSummaryTitle />
      <TransactionSummaryRow />
    </Section>
  );
}

function TransactionSummaryTitle() {
  const transaction = useRiskManagementStore((s) => s.currentTransaction);

  return (
    <div className="transaction-summary-title">
      Transaction Summary For{" "}
      <span className={sectionColor[transaction]}>
        {sectionLabels[transaction]}
      </span>
    </div>
  );
}

function TransactionSummaryRow() {
  const { transactionSummaryList } = useTradeSummary();

  return (
    <div className="transaction-summary-row">
      {transactionSummaryList.map((item, idx) => (
        <div className="transaction-summary-col" key={idx}>
          <span className="transaction-summary-label">{item.label}</span>
          <div className={`transaction-summary-value ${item?.style}`}>
            {item.label === "Net P&L (%)"
              ? safe(item.value, 2) + "%"
              : formatINR(item.value || 0)}
          </div>
        </div>
      ))}
    </div>
  );
}
