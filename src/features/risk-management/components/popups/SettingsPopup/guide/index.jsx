import { useCalculationGuide } from "@features/risk-management/hooks";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { Select } from "@shared/components/ui";
import { InputFields } from "./InputFields";
import { ManualInputs } from "./ManualInputs";
import { CalculatedFields } from "./CalculatedFields";
import { Summary } from "./Summary";
import { FIELD_LABELS, FIELDS } from "@features/risk-management/constants";
import { Section } from "@shared/components/layout";
import {
  getFormula,
  getPositionSizingFormula,
} from "@features/risk-management/utils";

export function CalculationLogicGuide({ updateSettings }) {
  const { selectedField, affected, userDefined, mainFields, formulaMap } =
    useCalculationGuide(updateSettings);

  const selectedSection = useRiskManagementStore(
    (s) => s.settings.selectedSection,
  );

  const isTargetOrSl =
    selectedSection === "Target" || selectedSection === "Stop-Loss";

  const isPositionSizing = selectedSection === "Position-Sizing";
  console.log("CalculationLogicGuide", selectedSection);

  const resolveFormula = (field, currentSectionOverride) => {
    if (isPositionSizing) {
      return getPositionSizingFormula(field, {
        affected,
        formulaMap,
      });
    }

    return getFormula(field, {
      currentSection: currentSectionOverride ?? selectedSection,
      affected,
      formulaMap,
    });
  };

  const tabs = [
    { key: "Calculator", label: "Charges Calculator" },
    { key: "Target", label: "Target" },
    { key: "Stop-Loss", label: "Stop-Loss" },
    { key: "Position-Sizing", label: "Position-Sizing" },
  ];

  return (
    <Section title="Calculation Logic Guide">
      <Select
        label="Select Calculator"
        options={tabs}
        getKey={(tab) => tab.key}
        getLabel={(tab) => tab.label}
        value={selectedSection}
        onChange={(tab) => updateSettings({ selectedSection: tab.key })}
      />
      <div className="settings-popup-grid">
        <InputFields
          selectedField={selectedField}
          updateSettings={updateSettings}
          mainFields={mainFields}
        />
        <div className="flex gap-2 items-center justify-center h-20">
          <span className="text-2xl">↓</span>
          <span className="text-sm text-(--text-muted) mt-1.5">
            When you Change in ({FIELD_LABELS[selectedField]})
          </span>
        </div>
        <ManualInputs userDefined={userDefined} />
        <CalculatedFields
          affected={affected}
          formulaMap={formulaMap}
          currentSection={selectedSection}
          resolveFormula={resolveFormula}
        />
        {isTargetOrSl && !isPositionSizing && (
          <CalculatedFields
            affected={FIELDS["target"]}
            formulaMap={formulaMap}
            currentSection={
              selectedSection === "Target" ? "Stop-Loss" : "Target"
            }
            resolveFormula={resolveFormula}
          />
        )}
      </div>

      <Summary
        affected={affected}
        selectedField={selectedField}
        currentSection={selectedSection}
      />
    </Section>
  );
}
