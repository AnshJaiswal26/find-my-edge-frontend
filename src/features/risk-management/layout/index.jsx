import {
  FIELD_LABELS,
  FIELDS,
  SECTION_COLOR,
  SECTION_LABELS,
} from "../constants";
import { CalculatorInput } from "@features/risk-management/components";
import styles from "./settingsLayout.module.css";
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
        <span className={SECTION_COLOR?.[section]}>
          {SECTION_LABELS?.[section]}
        </span>
      }
      onMouseEnter={() => (onMouseEnter ? onMouseEnter(section) : null)}
    >
      <div className="grid gap-3 grid-cols-3">
        {FIELDS?.[section]?.map((field) => (
          <CalculatorInput
            key={`${field}_${section}`}
            className={isReadOnly(field) ? "readOnly" : ""}
            label={FIELD_LABELS[field]}
            sectionName={section}
            field={field}
          />
        ))}
      </div>
      {footerElement}
    </Section>
  );
}

export function CalculatorInputGrid({ children, className, elementWidth }) {
  return (
    <div style={{ "--grid-width": elementWidth ? elementWidth : "130px" }}>
      <div className={`${styles.calculatorGrid} ${className}`}>{children}</div>
    </div>
  );
}

export function SettingsSectionWrapper({ children, style }) {
  return (
    <div className={styles.settingsSectionWrapper} style={style}>
      {children}
    </div>
  );
}
