import "./settings.css";
import { useRiskManagementStore } from "@RM/stores";
import {
  CalculationLogicGuide,
  CalculationModeSelector,
  DerivedModeSelector,
  QtyRoundSelector,
} from "./components";
import { SettingsSectionWrapper } from "@RM/layout";
import { Label } from "@layout";

function Settings() {
  const updateSettings = useRiskManagementStore((s) => s.updater.settings);
  const showPanel = useRiskManagementStore((s) => s.settings.showPanel);

  if (!showPanel) return null;

  return (
    <div className="settings-popup-overlay">
      <div className="settings-popup-container">
        {/* Header */}
        <div className="settings-popup-header">
          <div className="settings-popup-header-content">
            <span className="settings-popup-title">Settings</span>
            <button
              onClick={() => updateSettings({ showPanel: false })}
              className="settings-popup-close-button"
            >
              ×
            </button>
          </div>
        </div>

        <div className="settings-popup-body">
          <SettingsSectionWrapper>
            <Label>Applies to Calculator, Target & Stop-Loss</Label>

            <div className="divider"></div>

            <CalculationModeSelector updateSettings={updateSettings} />

            <div className="divider"></div>

            <DerivedModeSelector updateSettings={updateSettings} />
          </SettingsSectionWrapper>

          <SettingsSectionWrapper>
            <Label>Applies to Position-Sizing</Label>
            <div className="divider"></div>

            <QtyRoundSelector updateSettings={updateSettings} />
          </SettingsSectionWrapper>

          {/* <div className="divider"></div> */}

          <CalculationLogicGuide updateSettings={updateSettings} />
        </div>
      </div>
    </div>
  );
}

export default Settings;
