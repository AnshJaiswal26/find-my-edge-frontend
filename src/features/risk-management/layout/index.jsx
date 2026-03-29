import {
  FIELD_LABELS,
  FIELDS,
  SECTION_COLOR,
  SECTION_LABELS,
} from "../constants";
import { CalculatorInput } from "../components/CalculatorInput";
import { Section } from "@shared/components/layout";

export function CalculatorSectionLayout({
  section,
  footerElement,
  onMouseEnter,
}) {
  const isReadOnly = (f) => f === "suggestedQty" || f === "adjustedSl";

  return (
    <Section
      className="!px-4"
      title={
        <div className="flex justify-between items-center">
          <span className={SECTION_COLOR?.[section]}>
            {SECTION_LABELS?.[section]}
          </span>
          {footerElement}
        </div>
      }
      onMouseEnter={() => onMouseEnter?.(section)}
    >
      <div className="grid gap-3 grid-cols-3">
        {FIELDS[section]?.map((field) => (
          <CalculatorInput
            key={`${field}_${section}`}
            className={isReadOnly(field) ? "readOnly" : ""}
            label={FIELD_LABELS[field]}
            sectionName={section}
            field={field}
          />
        ))}
      </div>
    </Section>
  );
}
