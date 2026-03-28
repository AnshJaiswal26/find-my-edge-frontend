import { Container } from "@shared/components/layout";
import {
  ChargesSummarySection,
  TransactionSummarySection,
} from "@features/risk-management/components";

export function SummaryContainer() {
  return (
    <Container className="!min-h-fit">
      <TransactionSummarySection />
      <ChargesSummarySection />
    </Container>
  );
}
