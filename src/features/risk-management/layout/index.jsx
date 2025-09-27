import {
  fieldLabels,
  fields,
  sectionColor,
  sectionLabels,
} from "@features/risk-management/data";
import { Input } from "@features/risk-management/components";
import styles from "./settingsLayout.module.css";

export function CalculatorSectionLayout({
  section,
  headerElement,
  footerElement,
  onMouseEnter,
}) {
  const isReadOnly = (f) => f === "suggestedQty" || f === "adjustedSl";

  return (
    <div
      className={styles.sections}
      onMouseEnter={() => (onMouseEnter ? onMouseEnter(section) : null)}
    >
      <div className={styles.heading}>
        <span className={sectionColor?.[section]}>
          {sectionLabels?.[section]}
        </span>
        {headerElement}
      </div>

      <CalculatorInputGrid>
        {fields?.[section]?.map((field) => (
          <Input
            key={`${field}_${section}`}
            className={isReadOnly(field) ? "readOnly" : ""}
            label={fieldLabels[field]}
            sectionName={section}
            field={field}
          />
        ))}
      </CalculatorInputGrid>
      {footerElement}
    </div>
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
