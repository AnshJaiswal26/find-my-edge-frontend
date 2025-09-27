import { Button, ValidationTooltip } from "@ui";
import { Container } from "@layout";
import {
  Input,
  CalculatorSection,
  PyramidingSection,
} from "@features/risk-management/components";
import { useRiskManagementStore } from "@features/risk-management/stores";
import {
  useClearLogic,
  useFormatterLogic,
} from "@features/risk-management/hooks";

export function RiskRewardCalculatorContainer() {
  return (
    <>
      <div className="flex justify-between items-center">
        <RiskRewardInput />
        <div className="flex gap-4">
          <FormatButton />
          <ClearSectionButton />
        </div>
      </div>
      <CalculatorSection sectionName={"target"} />
      <CalculatorSection sectionName={"stopLoss"} />
      <PyramidingSection />
    </>
  );
}

function RiskRewardInput() {
  const tooltip = useRiskManagementStore((s) => s["riskRewardTooltip"].ratio);
  const showTooltip = useRiskManagementStore((s) => s.updater.tooltip);
  const riskReward = useRiskManagementStore((s) => s.riskReward);

  return (
    <div className="relative">
      <Input
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
function FormatButton() {
  const { format, mode } = useFormatterLogic();

  return (
    <Button
      text="Format"
      title={"Current Mode : " + mode}
      color="#e8bd3eff"
      onClick={format}
      style={{
        padding: "5px 10px",
        fontSize: "12px",
      }}
    />
  );
}

function ClearSectionButton() {
  const clearSection = useClearLogic();

  return (
    <>
      <Button
        text="Clear All"
        color="#fe5a5a"
        onClick={() => clearSection("target")}
        style={{
          padding: "5px 10px",
          fontSize: "12px",
        }}
      />
    </>
  );
}
