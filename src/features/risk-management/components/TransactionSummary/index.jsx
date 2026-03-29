import { Section } from "@shared/components/layout";
import { TransactionSummaryTitle } from "./TransactionSummaryTitle";
import { TransactionSummaryRow } from "./TransactionSummaryRow";

export function TransactionSummary() {
  return (
    <Section className="px-4">
      <TransactionSummaryTitle />
      <TransactionSummaryRow />
    </Section>
  );
}
