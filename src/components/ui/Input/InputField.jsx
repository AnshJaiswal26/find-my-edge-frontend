import { useEffect, useState } from "react";
import { parseInputValue, formatForInput } from "@utils";
import { BASE_CLASS } from "./baseClasses";

function getInputType(semantic, type) {
  // fallback (for legacy or external usage)
  if (!semantic) return type;

  switch (semantic) {
    case "number":
      return "number";

    case "date":
      return "date";

    case "time":
      return "time";

    case "datetime":
      return "datetime-local";

    case "duration":
      return "text"; // 🔥 important (custom parsing)

    case "boolean":
      return "checkbox";

    case "string":
      return "text";

    case "range":
      return "range";

    default:
      return "text";
  }
}

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
        type={getInputType(type, "text")}
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
