import "./RiskManagement.css";
import { PageContainer } from "@layout";
import {
  CapitalInputContainer,
  SummaryContainer,
  CalculatorAndPositionsContainer,
  Settings,
} from "./components";

function RiskManagement() {
  return (
    <PageContainer pageActive={"riskmanagement"}>
      <Settings />
      <div className="flex-box">
        <div className="flex-box flex-col flex-1">
          <CapitalInputContainer />
          <SummaryContainer />
        </div>
        <CalculatorAndPositionsContainer />
      </div>
    </PageContainer>
  );
}

export default RiskManagement;
