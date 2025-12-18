import { TabSelector } from "@ui";
import {
  Arrow,
  CalculatedFields,
  InputFields,
  ManualInputs,
  Summary,
} from "./GuideComponents";
import { useCalculationGuide } from "@features/risk-management/hooks";
import { fields } from "@features/risk-management/data";
import { useMemo } from "react";
import { useRiskManagementStore } from "@features/risk-management/stores";
import { SettingsSectionWrapper } from "@features/risk-management/layout";

export default function CalculationLogicGuide({ updateSettings }) {
  const { selectedField, affected, userDefined, mainFields, formulaMap } =
    useCalculationGuide();

  const selectedSection = useRiskManagementStore(
    (s) => s.settings.selectedSection
  );

  const isTargetOrSl = useMemo(
    () => selectedSection === "Target" || selectedSection === "Stop-Loss",
    [selectedSection]
  );

  const tabs = [
    { key: "Calculator", label: "Normal" },
    { key: "Target", label: "Target" },
    { key: "Stop-Loss", label: "Stop-Loss" },
    { key: "Position-Sizing", label: "Position-Sizing" },
  ];

  return (
    <div>
      <TabSelector
        tabs={tabs}
        tabStyle={{ marginBottom: "0px" }}
        currentTab={selectedSection}
        onClick={(tab) => updateSettings({ selectedSection: tab })}
        style={{ padding: "10px 15px" }}
      />
      <SettingsSectionWrapper>
        <span className="text-(--text)">Calculation Logic Guide</span>

        <div className="divider"></div>

        <div className="settings-popup-grid">
          <InputFields
            selectedField={selectedField}
            updateSettings={updateSettings}
            mainFields={mainFields}
          />
          <Arrow selectedField={selectedField} />
          <ManualInputs userDefined={userDefined} />
          <CalculatedFields
            affected={affected}
            formulaMap={formulaMap}
            currentSection={selectedSection}
          />
          {isTargetOrSl && (
            <CalculatedFields
              affected={fields["target"]}
              formulaMap={formulaMap}
              currentSection={
                selectedSection === "Target" ? "Stop-Loss" : "Target"
              }
            />
          )}{" "}
        </div>

        <Summary
          affected={affected}
          selectedField={selectedField}
          currentSection={selectedSection}
        />
      </SettingsSectionWrapper>
    </div>
  );
}
