import { useEffect, useState } from "react";
import { parseInputValue, formatForInput } from "@utils";
import { BASE_CLASS } from "./baseClasses";

const typeMap = {
  select: "text",
  "date computed": "date",
  "time computed": "time",
  "number computed": "number",
};

export function InputField({
  type = "text",
  value,
  normalize = false,
  sizes,
  formatter,
  onChange,
  onCommit,
  onBlur,
  classNames,
  ...props
}) {
  const commitMode = typeof onCommit === "function";
  const [local, setLocal] = useState(value);

  useEffect(() => {
    if (commitMode) setLocal(value);
  }, [value, commitMode]);

  const rawValue = commitMode ? local : value;

  const displayValue = normalize
    ? formatForInput(rawValue, type)
    : (rawValue ?? "");

  const handleChange = (e) => {
    const parsed = normalize
      ? parseInputValue(e.target.value, type)
      : e.target.value;

    commitMode ? setLocal(parsed) : onChange?.(e, parsed);
  };

  const handleBlur = (e) => {
    if (commitMode) onCommit?.(local);
    onBlur?.(e);
  };

  return (
    <div className={type === "range" ? "flex items-center gap-2" : "w-full"}>
      {type === "range" && (
        <span className="text-[0.85rem] text-(--text)">
          {formatter(displayValue)}
        </span>
      )}
      <input
        {...props}
        step={1}
        type={typeMap[type] ?? type}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`
        ${BASE_CLASS}
        max-w-50 min-w-30 py-4.5
        ${type === "range" ? "py-0!" : sizes?.input}
        ${classNames?.input}
      `}
      />
    </div>
  );
}
