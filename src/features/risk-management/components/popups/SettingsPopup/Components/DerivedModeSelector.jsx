import { useCallback } from "react";
import { ButtonSelector, Overview } from "@ui";
import { fieldLabels } from "../../../../data/calculatorsData";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { derivedInputPoints } from "@features/risk-management/data/settingsData";
import {
  generateTooltip,
  logResult,
  logStart,
} from "@features/risk-management/utils";

export default function DerivedModeSelector({ updateSettings }) {
  const derivedInput = useRiskManagementStore((s) => s.settings.derivedInput);
  const adjust = useRiskManagementStore((s) => s.settings.adjustedField);
  const updateSections = useRiskManagementStore((s) => s.updater.sections);

  const label = fieldLabels[derivedInput];
  const explanationPoints = derivedInputPoints(label);

  const showTooltipForInvalids = useCallback(
    (sec, m, track) => {
      const fields = ["buyPrice", "sellPrice"];
      const m1 = m === "amount" ? adjust : m;
      const m2 = track === "adjustedField" ? "amount" : m;

      const updates = fields.reduce((acc, f) => {
        const isNeg = sec[f] < 0;
        if (isNeg && m1 !== f) acc[f] = generateTooltip(f, "adjust", m2);
        else if (isNeg) acc[f] = generateTooltip(f, "negative", m2);
        return acc;
      }, {});

      return Object.keys(updates).length > 0
        ? ["tooltip", sec.name + "Tooltip", updates]
        : [];
    },
    [adjust]
  );

  const handleDependencyChange = useCallback(
    (mode, track) => {
      logStart("handleDependencyChange", mode);
      const sections = useRiskManagementStore.getState();
      const invalids = ["calculator", "target", "stopLoss"]
        .map((sec) => sections[sec])
        .filter((sec) => sec.buyPrice < 0 || sec.sellPrice < 0);

      const sectionUpdates = invalids.map((sec) =>
        showTooltipForInvalids(sec, mode, track)
      );

      sectionUpdates.push(["settings", "settings", { [track]: mode }]);
      updateSections(sectionUpdates);

      logResult("handleDependencyChange", "Changes Done for " + mode);
    },
    [showTooltipForInvalids, updateSections]
  );

  return (
    <div className="settings-popup-section">
      <div>
        <ButtonSelector
          label={"Derived Input"}
          options={["amount", "buyPrice", "sellPrice"]}
          selectedOption={derivedInput}
          onSelect={(m) => handleDependencyChange(m, "derivedInput")}
          fieldFormatter={fieldLabels}
        />
      </div>
      {derivedInput === "amount" && (
        <div className="settings-popup-label flex center gap10">
          <span className="margin-bottom-10">When Amount changes adjust →</span>
          <ButtonSelector
            options={["buyPrice", "sellPrice"]}
            selectedOption={adjust}
            onSelect={(m) => handleDependencyChange(m, "adjustedField")}
            size="small"
            fieldFormatter={fieldLabels}
          />
        </div>
      )}
      <Overview
        title={"📘 Derived Input Overview"}
        pointsArray={explanationPoints[derivedInput]}
      />
    </div>
  );
}
