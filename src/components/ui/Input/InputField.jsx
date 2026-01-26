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
    <input
      {...props}
      step={1}
      type={typeMap[type] ?? type}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`
        ${BASE_CLASS}
        max-w-50 min-w-30 py-4.5!
        ${sizes?.input}
        ${classNames?.input}
      `}
    />
  );
}
