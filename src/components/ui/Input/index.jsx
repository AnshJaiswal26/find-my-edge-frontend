export function Input({ label, labelPosition = "left", type = "text", value }) {
  return (
    <div className={`${styles.field} ${styles[labelPosition]}`}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className={styles.numberInput}
      />
    </div>
  );
}

export function Input({ label, labelPosition = "left", type = "text", value }) {
  return (
    <div className={`${styles.field} ${styles[labelPosition]}`}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className={styles.numberInput}
      />
    </div>
  );
}
