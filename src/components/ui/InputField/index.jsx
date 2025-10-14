import styles from "./InputField.module.css";

export default function InputField({
  label,
  labelPosition = "left",
  type = "text",
  selector,
  onChange,
  max,
  min,
  step = 1,
  placeHolder = "",
  formatter = (v) => v,
  className,
  store,
}) {
  const value =
    store && typeof selector === "function" ? store(selector) : selector;

  return (
    <div className={`${styles.field} ${styles?.[labelPosition]}`}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className="flex items-center gap-1">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeHolder}
          className={`${styles.input} ${className}`}
        />
        {type === "range" && formatter(value)}
      </div>
    </div>
  );
}
