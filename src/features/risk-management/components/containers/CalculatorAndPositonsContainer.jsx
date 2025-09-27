import { useMemo } from "react";
import { PopupMessage, TabSwitcher } from "@ui";
import {
  RiskRewardCalculatorContainer,
  CurrentPositionsContainer,
  NormalCalculatorContainer,
} from "@features/risk-management/components";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { Container } from "@layout";

export function CalculatorAndPositionsContainer() {
  return (
    <div className="flex-[1.1] min-w-[360px] relative">
      <Messages />
      <TabContainer />
    </div>
  );
}

function Messages() {
  const showMsg = useRiskManagementStore((s) => s.updater.showMsg);
  const isChargesAdded = useRiskManagementStore((s) => s.isChargesAdded);
  const isChargesRemoved = useRiskManagementStore((s) => s.isChargesRemoved);

  return (
    <>
      {[
        {
          type: "isChargesAdded",
          isVisible: isChargesAdded,
          msg: "Charges Added",
        },
        {
          type: "isChargesRemoved",
          isVisible: isChargesRemoved,
          msg: "Charges Removed",
        },
      ].map(({ type, isVisible, msg }, index) => (
        <PopupMessage
          key={`${Date.now()}-${index}`}
          message={msg}
          type="success"
          duration={1200}
          isVisible={isVisible}
          onClose={() => showMsg(type, false)}
          showCloseButton={false}
        />
      ))}
    </>
  );
}

function TabContainer() {
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
    <>
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
    </>
  );
}
