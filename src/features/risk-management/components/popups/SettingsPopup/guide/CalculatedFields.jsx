import { FIELD_LABELS } from "@features/risk-management/constants";
import { Section } from "@shared/components/layout";

export function CalculatedFields({
  affected,
  formulaMap,
  currentSection,
  resolveFormula,
}) {
  const createFormula = (field) => resolveFormula(field, currentSection);

  const isRRAndLengthIs6 =
    affected.length === 6 && formulaMap.name === "riskReward";

  return (
    <Section subSection className="mt-4">
      <div className="section-title calc-title">
        🧮 Calculated Inputs - {isRRAndLengthIs6 ? 0 : affected.length}{" "}
        {currentSection && "in (" + currentSection + ")"}
      </div>
      {isRRAndLengthIs6 ? (
        <div className="field-card calc-card"> Every Field Remains Same</div>
      ) : (
        <div className="flex flex-col gap-3">
          {affected.map((field) => (
            <div
              key={field}
              className="bg-(--info-soft) p-3 rounded border border-(--info-soft) flex flex-col gap-1"
            >
              <span className="text-(--text)">{FIELD_LABELS[field]}</span>
              <span className="text-(--text-muted)">Auto-calculated</span>

              <div className="bg-white p-2 rounded">
                <div className="text-(--text-muted) text-xs">Formula:</div>
                <div className="text-(--info) text-sm mt-0.5">
                  {createFormula(field)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
