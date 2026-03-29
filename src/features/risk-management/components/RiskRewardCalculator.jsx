import { ValidationTooltip } from "@shared/components/ui";

import { useRiskManagementStore } from "../stores";
import { FormatButton } from "./FormatButton";
import { CalculatorInput } from "./CalculatorInput";
import { PyramidingCalculator } from "./PyramidingCalculator";
import { Calculator } from "./Calculator";
import { ResetInputsButton } from "./ResetInputsButton";

export function RiskRewardCalculator() {
  return (
    <>
      <div className="flex justify-between items-center">
        <RiskRewardInput />
        <div className="flex gap-3">
          <FormatButton />
          <ResetInputsButton sectionName={"target"} />
        </div>
      </div>
      <Calculator sectionName={"target"} />
      <Calculator sectionName={"stopLoss"} />
      <PyramidingCalculator />
    </>
  );
}

function RiskRewardInput() {
  const tooltip = useRiskManagementStore((s) => s["riskRewardTooltip"].ratio);
  const showTooltip = useRiskManagementStore((s) => s.updater.tooltip);
  const riskReward = useRiskManagementStore((s) => s.riskReward);

  return (
    <div className="relative">
      <CalculatorInput
        className={tooltip ? "info" : ""}
        label="Risk/Reward"
        sectionName={"riskReward"}
        field={"ratio"}
        enableTooltip={false}
      />
      <ValidationTooltip
        message={`To actually earn 1: ${riskReward.prevRatio} after charges, plan for a slightly wider target: around 1: ${riskReward.ratio}.`}
        position="top"
        type="info"
        isVisible={tooltip}
        onClose={() => showTooltip("riskReward", false)}
        duration={7000}
        autoHide={true}
        showCloseButton={true}
      />
    </div>
  );
}
