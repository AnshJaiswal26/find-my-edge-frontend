import { Container } from "@shared/components/layout";
import { TabSelector } from "@shared/components/ui";
import { useState } from "react";
import { NormalCalculator } from "./NormalCalculator";
import { RiskRewardCalculator } from "./RiskRewardCalculator";
import { CurrentPositions } from "./CurrentPositions";

const TabMap = {
  normal: NormalCalculator,
  "risk-management": RiskRewardCalculator,
  positions: CurrentPositions,
};

export function CalculatorAndPositionsContainer() {
  const [tab, setTab] = useState("normal");
  const Tab = TabMap[tab] || null;

  return (
    <div className="flex-[6.5] min-w-[360px] relative min-h-0 h-fit">
      <TabSelector
        tabs={[
          { key: "normal", label: "Position Sizing" },
          { key: "risk-management", label: "Risk Management & Pyramiding" },
          { key: "positions", label: "Current Positions" },
        ]}
        currentTab={tab}
        onClick={setTab}
      />

      <Container className="rounded-t-none" childClassName="!gap-4">
        <Tab />
      </Container>
    </div>
  );
}
