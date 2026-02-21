import { ButtonSelector, Overview } from "@shared/components/ui";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { calculationPoints } from "@features/risk-management/data";

export default function CalculationModeSelector({ updateSettings }) {
  const autoRound = useRiskManagementStore((s) => s.settings.autoRound);

  return (
    <>
      <div className="settings-popup-label-container">
        <div className="settings-popup-label">Round Mode</div>
        <Button.Toggle
          label={["Auto-Rounding"]}
          toggleOn={autoRound}
          onClick={() => updateSettings({ autoRound: !autoRound })}
          color={"#1d4ed8"}
        />
      </div>
      <SelectorAndOverview updateSettings={updateSettings} />
    </>
  );
}

function SelectorAndOverview({ updateSettings }) {
  const calcMode = useRiskManagementStore((s) => s.settings.roundMode);

  return (
    <>
      <ButtonSelector
        options={["Approx", "Market", "Buffer"]}
        selectedOption={calcMode}
        onSelect={(mode) => updateSettings({ roundMode: mode })}
      />
      <Overview
        title={"⚙️ Round Mode Overview"}
        pointsArray={calculationPoints[calcMode]}
        withNote={true}
        note={
          <>
            📌 <strong>Note:</strong> For placing target or stop-loss orders,
            it's recommended to keep the <strong>Calculation Mode</strong> set
            to <em>Buffer</em> or <em>Market</em> to ensure compatibility with
            tick-size and exchange constraints.
          </>
        }
      />
    </>
  );
}
