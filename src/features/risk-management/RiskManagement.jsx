import {
  CalculatorAndPositionsContainer,
  CapitalInput,
  ChargesSummary,
  Settings,
  TransactionSummary,
} from "./components";

import { Container } from "@shared/components/layout";

export default function RiskManagement() {
  return (
    <>
      <Settings />
      <div className="flex flex-row gap-5 flex-1 flex-wrap">
        <div className="flex flex-col gap-5 flex-6 min-h-0 max-h-fit">
          <CapitalInput />
          <Container className="!min-h-fit" childClassName="!gap-4">
            <TransactionSummary />
            <ChargesSummary />
          </Container>
        </div>
        <CalculatorAndPositionsContainer />
      </div>
    </>
  );
}
