import { Container } from "@shared/components/layout";
import { TabSelector } from "@shared/components/ui";
import { NormalCalculator } from "./NormalCalculator";
import { RiskRewardCalculator } from "./RiskRewardCalculator";
import { useRiskManagementStore } from "../stores";

const TabMap = {
  normal: NormalCalculator,
  "risk-management": RiskRewardCalculator,
  // positions: CurrentPositions,
};

export function CalculatorAndPositionsContainer() {
  const currentTab = useRiskManagementStore((s) => s.currentTab);
  const updateTab = useRiskManagementStore((s) => s.updater.tab);

  const Tab = TabMap[currentTab] || null;

  return (
    <div className="flex-[6.5] min-w-[360px] relative min-h-0 h-fit">
      <TabSelector
        tabs={[
          { key: "normal", label: "Position Sizing" },
          { key: "risk-management", label: "Risk Management & Pyramiding" },
          // { key: "positions", label: "Current Positions" },
        ]}
        currentTab={currentTab}
        onClick={updateTab}
      />

      <Container className="rounded-t-none" childClassName="!gap-4">
        <Tab />
      </Container>
    </div>
  );
}
