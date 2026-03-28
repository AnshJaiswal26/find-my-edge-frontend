import { Button, ValidationTooltip } from "@shared/components/ui";
import {
  CalculatorInput,
  CalculatorSection,
  PyramidingSection,
} from "@features/risk-management/components";
import { useRiskManagementStore } from "@features/risk-management/stores";
import {
  useClearLogic,
  useFormatterLogic,
} from "@features/risk-management/hooks";
import { hideTooltip, showTooltip } from "@shared/components/ui/tooltip";
import { RefreshCcw, RemoveFormatting } from "lucide-react";

export function RiskRewardCalculatorContainer() {
  return (
    <>
      <div className="flex justify-between items-center">
        <RiskRewardInput />
        <div className="flex gap-3">
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
function FormatButton() {
  const { format, mode } = useFormatterLogic();

  return (
    <Button.Icon
      onClick={format}
      onMouseEnter={(e) =>
        showTooltip(e, { content: `Format (Current Mode: ${mode})` })
      }
      onMouseLeave={hideTooltip}
    >
      <RemoveFormatting size={16} />
    </Button.Icon>
  );
}

function ClearSectionButton() {
  const clearSection = useClearLogic();

  return (
    <Button.Icon
      onClick={() => clearSection("target")}
      onMouseEnter={(e) => showTooltip(e, { content: "Reset Inputs" })}
      onMouseLeave={hideTooltip}
    >
      <RefreshCcw size={16} />
    </Button.Icon>
  );
}
