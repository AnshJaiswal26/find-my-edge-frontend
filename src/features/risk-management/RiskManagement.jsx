import "./RiskManagement.css";
import {
  CalculatorAndPositionsContainer,
  CapitalInputContainer,
  Settings,
  SummaryContainer,
} from "./components";

function RiskManagement() {
  return (
    <>
      <Settings />
      <div className="flex flex-row gap-5 flex-1 flex-wrap">
        <div className="flex flex-col gap-5 flex-6 min-h-0 max-h-fit">
          <CapitalInputContainer />
          <SummaryContainer />
        </div>
        <CalculatorAndPositionsContainer />
      </div>
    </>
  );
}

export default RiskManagement;
