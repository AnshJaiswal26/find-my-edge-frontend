import { useEffect, useState } from "react";
import { formatForInput, INPUT_TYPES, parseInputValue } from "@shared/utils";
import { BASE_CLASS } from "./baseClasses";
import DurationInput from "./DurationInput";

export function InputField({
  type = "text",
  value,
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

  /* ------ DURATION (SPECIAL CASE) -------- */
  if (type === "duration") {
    return (
      <DurationInput
        value={formatForInput(rawValue, type)}
        onChange={(val) => {
          commitMode
            ? setLocal(val)
            : onChange?.(parseInputValue(val, "duration"));
        }}
        onBlur={(val, e) => {
          const parsed = parseInputValue(val, "duration");
          if (commitMode) onCommit?.(parsed);
          onBlur?.(e);
        }}
        className={`py-4.5 ${sizes?.input} ${classNames?.input}`}
        wrapperClassName="flex focus-within:border-(--info) border border-(--border) rounded"
        {...props}
      />
    );
  }

  const displayValue = formatForInput(rawValue, type);

  const handleChange = (e) => {
    const parsed = parseInputValue(e.target.value, type);

    commitMode ? setLocal(parsed) : onChange?.(parsed, e);
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
        type={INPUT_TYPES[type] || "text"}
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
