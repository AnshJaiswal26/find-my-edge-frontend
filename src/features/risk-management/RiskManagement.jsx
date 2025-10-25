import "./RiskManagement.css";
import {
  CapitalInputContainer,
  SummaryContainer,
  CalculatorAndPositionsContainer,
  Settings,
} from "./components";

function RiskManagement() {
  return (
    <>
      <Settings />
      <div className="flex-box">
        <div className="flex-box flex-col flex-1">
          <CapitalInputContainer />
          <SummaryContainer />
        </div>
        <CalculatorAndPositionsContainer />
      </div>
    </>
  );
}

export default RiskManagement;
