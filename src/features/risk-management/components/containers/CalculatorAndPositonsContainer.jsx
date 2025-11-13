import { useMemo } from "react";
import { TabSwitcher } from "@ui";
import {
  RiskRewardCalculatorContainer,
  CurrentPositionsContainer,
  NormalCalculatorContainer,
} from "@features/risk-management/components";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { Container } from "@layout";

export function CalculatorAndPositionsContainer() {
  const updateTab = useRiskManagementStore((s) => s.updater.tab);
  const currentTab = useRiskManagementStore((s) => s.currentTab);

  const tabs = useMemo(
    () => [
      { key: "normal", label: "Position Sizing" },
      { key: "risk-management", label: "Risk Management & Pyramiding" },
      { key: "positions", label: "Current Positions" },
    ],
    []
  );

  return (
    <div className="flex-[1.1] min-w-[360px] relative">
      <TabSwitcher
        tabs={tabs}
        currentTab={currentTab}
        onClick={(tab) => updateTab(tab)}
      />

      <Container className="rounded-t-none">
        {currentTab === "normal" ? (
          <NormalCalculatorContainer />
        ) : currentTab === "risk-management" ? (
          <RiskRewardCalculatorContainer />
        ) : (
          <CurrentPositionsContainer />
        )}
      </Container>
    </div>
  );
}
