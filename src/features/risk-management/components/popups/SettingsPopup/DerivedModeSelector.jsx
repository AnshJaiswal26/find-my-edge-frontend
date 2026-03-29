import {
  derivedInputPoints,
  FIELD_LABELS,
} from "@features/risk-management/constants";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { generateTooltip } from "@features/risk-management/utils";

import { Overview, Select } from "@shared/components/ui";
import { Section } from "@shared/components/layout";

export function DerivedModeSelector({ updateSettings }) {
  const derivedInput = useRiskManagementStore((s) => s.settings.derivedInput);
  const adjust = useRiskManagementStore((s) => s.settings.adjustedField);
  const updateSections = useRiskManagementStore((s) => s.updater.sections);

  const label = FIELD_LABELS[derivedInput];
  const explanationPoints = derivedInputPoints(label);

  const showTooltipForInvalids = (sec, m, track) => {
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
  };

  const handleDependencyChange = (mode, track) => {
    const sections = useRiskManagementStore.getState();
    const invalids = ["calculator", "target", "stopLoss"]
      .map((sec) => sections[sec])
      .filter((sec) => sec.buyPrice < 0 || sec.sellPrice < 0);

    const sectionUpdates = invalids.map((sec) =>
      showTooltipForInvalids(sec, mode, track),
    );

    sectionUpdates.push(["settings", "settings", { [track]: mode }]);
    updateSections(sectionUpdates);
  };

  return (
    <Section subSection>
      <Select
        label="Derived Input"
        options={["amount", "buyPrice", "sellPrice"]}
        getLabel={(k) => FIELD_LABELS[k]}
        value={derivedInput}
        onChange={(v) => handleDependencyChange(v, "derivedInput")}
      />
      {derivedInput === "amount" && (
        <Select
          label="On Amount change adjust"
          options={["buyPrice", "sellPrice"]}
          getLabel={(k) => FIELD_LABELS[k]}
          value={adjust}
          onChange={([v]) => handleDependencyChange(v, "adjustedField")}
        />
      )}
      <Overview
        title={"📘 Derived Input Overview"}
        pointsArray={explanationPoints[derivedInput]}
      />
    </Section>
  );
}
