import { Container } from "@layout";
import {
  ChargesSummarySection,
  TransactionSummarySection,
} from "@features/risk-management/components";

export function SummaryContainer() {
  console.log("SummaryContainer...");

  return (
    <Container>
      <TransactionSummarySection />
      <ChargesSummarySection />
    </Container>
  );
}
