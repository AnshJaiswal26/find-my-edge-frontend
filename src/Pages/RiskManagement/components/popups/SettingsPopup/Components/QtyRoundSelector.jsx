import { ButtonSelector, Overview } from "@components";
import { qtyRoundModePoints } from "@RM/data";
import { useRiskManagementStore } from "@RM/stores";

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
