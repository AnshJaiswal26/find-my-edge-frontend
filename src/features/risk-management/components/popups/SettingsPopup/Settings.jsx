import { useRiskManagementStore } from "@features/risk-management/stores";
import {
  CalculationLogicGuide,
  CalculationModeSelector,
  DerivedModeSelector,
  QtyRoundSelector,
} from "./components";
import { SettingsSectionWrapper } from "@features/risk-management/layout";
import "./settings.css";

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
            <span className="text-(--text)">
              Applies to Calculator, Target & Stop-Loss
            </span>

            <div className="divider"></div>

            <CalculationModeSelector updateSettings={updateSettings} />

            <div className="divider"></div>

            <DerivedModeSelector updateSettings={updateSettings} />
          </SettingsSectionWrapper>

          <SettingsSectionWrapper>
            <span className="text-(--text)">Applies to Position-Sizing</span>

            <div className="divider"></div>

            <QtyRoundSelector updateSettings={updateSettings} />
          </SettingsSectionWrapper>

          <CalculationLogicGuide updateSettings={updateSettings} />
        </div>
      </div>
    </div>
  );
}

export default Settings;
