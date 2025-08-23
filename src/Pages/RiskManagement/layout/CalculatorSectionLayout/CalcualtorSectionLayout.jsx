import { fieldLabels, fields, sectionColor, sectionLabels } from "@RM/data";
import styles from "./CalculatorSection.module.css";
import { InputGridBox } from "..";
import { Input } from "@RM/components";

export default function CalculatorSectionLayout({
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
      <InputGridBox>
        {fields?.[section]?.map((field) => (
          <Input
            key={`${field}_${section}`}
            className={isReadOnly(field) ? "readOnly" : ""}
            label={fieldLabels[field]}
            sectionName={section}
            field={field}
          />
        ))}
      </InputGridBox>
      {footerElement}
    </div>
  );
}
