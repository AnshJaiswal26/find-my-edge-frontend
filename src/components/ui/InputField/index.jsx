import { useResolvedValue } from "@hooks";
import styles from "./InputField.module.css";

export default function InputField({
  label,
  size = "large",
  labelPosition = "left",
  type = "text",
  value,
  onChange,
  max,
  min,
  step = 1,
  placeholder = "",
  formatter = (v) => v,
  className,
  store,
}) {
  const val = useResolvedValue(store, value);

  return (
    <div
      className={`${styles.field} ${styles?.[labelPosition]} ${styles?.[size]}`}
    >
      <label>{label}</label>
      <div className="flex items-center gap-2">
        {type === "range" && (
          <span className="text-[0.85rem]">{formatter(val)}</span>
        )}
        <input
          type={type}
          value={val}
          onChange={(e) =>
            onChange(
              type === "number" ? Number(e.target.value) : e.target.value
            )
          }
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`${styles.input} ${className}`}
        />
      </div>
    </div>
  );
}
