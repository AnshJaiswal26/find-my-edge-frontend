import { useRiskManagementStore } from "@features/risk-management/stores";
import { Popup, Section } from "@shared/components/layout";
import { Overview, Select } from "@shared/components/ui";
import {
  CALCULATION_POINTS,
  QTY_ROUND_MODE_POINTS,
} from "@features/risk-management/constants";
import { DerivedModeSelector } from "./DerivedModeSelector";
import { CalculationLogicGuide } from "./guide";

export function Settings() {
  const updateSettings = useRiskManagementStore((s) => s.updater.settings);
  const showPanel = useRiskManagementStore((s) => s.settings.showPanel);
  const calcMode = useRiskManagementStore((s) => s.settings.roundMode);
  const mode = useRiskManagementStore((s) => s.settings.roundQtyTo);

  if (!showPanel) return null;

  return (
    <Popup open>
      <Popup.Container>
        <Popup.Header
          title={"Settings"}
          onClose={() => updateSettings({ showPanel: false })}
        />
        <Popup.Body className="space-y-4 !py-4 !px-2.5">
          <Section title="Applies to Calculator, Target & Stop-Loss">
            <Section subSection>
              <Select
                label={"Round Mode"}
                options={["Approx", "Market", "Buffer"]}
                value={calcMode}
                onChange={(mode) => updateSettings({ roundMode: mode })}
              />

              <Overview
                title={"⚙️ Round Mode Overview"}
                pointsArray={CALCULATION_POINTS[calcMode]}
                withNote={true}
                note={
                  <>
                    📌 <strong>Note:</strong> For placing target or stop-loss
                    orders, it's recommended to keep the{" "}
                    <strong>Calculation Mode</strong> set to <em>Buffer</em> or{" "}
                    <em>Market</em> to ensure compatibility with tick-size and
                    exchange constraints.
                  </>
                }
              />
            </Section>

            <DerivedModeSelector updateSettings={updateSettings} />
          </Section>

          <Section title="Applies to Position-Sizing">
            <Select
              label={"Round Qty To"}
              options={["Nearest", "Up", "Down"]}
              value={mode}
              onChange={(mode) => updateSettings({ roundQtyTo: mode })}
            />
            <Overview
              title={"⚙️ Qty Round Mode Overview"}
              pointsArray={QTY_ROUND_MODE_POINTS[mode]}
            />
          </Section>

          <CalculationLogicGuide updateSettings={updateSettings} />
        </Popup.Body>
      </Popup.Container>
    </Popup>
  );
}
