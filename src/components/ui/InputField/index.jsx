import { useResolvedValue } from "@hooks";
import styles from "./InputField.module.css";

export default function InputField({
  label,
  labelPosition = "left",
  type = "text",
  value,
  onChange,
  max,
  min,
  step = 1,
  placeHolder = "",
  formatter = (v) => v,
  className,
  store,
}) {
  const val = useResolvedValue(store, value);

  return (
    <div className={`${styles.field} ${styles?.[labelPosition]}`}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className="flex items-center gap-1">
        <input
          type={type}
          value={val}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeHolder}
          className={`${styles.input} ${className}`}
        />
        {type === "range" && formatter(val)}
      </div>
    </div>
  );
}
