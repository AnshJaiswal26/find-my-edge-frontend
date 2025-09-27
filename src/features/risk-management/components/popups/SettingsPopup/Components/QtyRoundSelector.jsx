import { ButtonSelector, Overview } from "@ui";
import { qtyRoundModePoints } from "@features/risk-management/data";
import { useRiskManagementStore } from "@features/risk-management/stores";

export default function QtyRoundSelector({ updateSettings }) {
  const mode = useRiskManagementStore((s) => s.settings.roundQtyTo);

  return (
    <>
      <ButtonSelector
        label={"Round Qty To"}
        options={["Nearest", "Up", "Down"]}
        selectedOption={mode}
        onSelect={(mode) => updateSettings({ roundQtyTo: mode })}
      />
      <Overview
        title={"⚙️ Qty Round Mode Overview"}
        pointsArray={qtyRoundModePoints[mode]}
      />
    </>
  );
}
