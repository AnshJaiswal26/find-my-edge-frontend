import { FIELD_LABELS, FIELDS } from "@features/risk-management/constants";
import { Section } from "@shared/components/layout";

export function Summary({ affected, selectedField, currentSection }) {
  const isTargetOrSl =
    currentSection === "Target" || currentSection === "Stop-Loss";
  const oppositeSection = currentSection === "Target" ? "Stop-Loss" : "Target";

  return (
    <Section subSection>
      <div className="text-(--text-muted)">
        Change in{" "}
        <span className="text-(--success)">{FIELD_LABELS[selectedField]}</span>{" "}
        in {currentSection} →{" "}
        <span className="text-(--info)">
          {affected.map((field) => FIELD_LABELS[field]).join(", ")}
        </span>{" "}
        {affected.length < 2 ? "is" : "are"} Auto-Calculated.
      </div>

      {isTargetOrSl && selectedField !== "riskReward" && (
        <div className="text-(--text-muted)">
          <span>
            Auto-Calculated inputs in {oppositeSection} →{" "}
            <span className="text-(--info)">
              {FIELDS["target"].map((field) => FIELD_LABELS[field]).join(", ")}
            </span>{" "}
          </span>
        </div>
      )}
    </Section>
  );
}
