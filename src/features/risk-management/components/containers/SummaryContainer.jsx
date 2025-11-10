import { Container } from "@layout";
import {
  ChargesSummarySection,
  TransactionSummarySection,
} from "@features/risk-management/components";

export function SummaryContainer() {
  return (
    <Container className="flex-none w-full">
      <TransactionSummarySection />
      <ChargesSummarySection />
    </Container>
  );
}
