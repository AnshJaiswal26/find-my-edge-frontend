import { useEffect, useState } from "react";

const sizeClasses = {
  lg: { label: "text-lg", input: "px-4 py-2 text-lg" },
  md: { label: "text-sm", input: "px-3 py-2 text-sm" },
  sm: {
    label: "text-[0.87rem]",
    input: "px-[0.6rem] py-[0.3rem] text-[0.87rem]",
  },
};

export default function Input({
  size = "md",
  type = "text",
  vertical = false,
  label,
  value,
  onChange,
  onCommit,
  onBlur,
  classNames,
  formatter = (v) => v,
  ...props
}) {
  const isCommitMode = typeof onCommit === "function";
  const [local, setLocal] = useState(value);

  const sizes = sizeClasses[size];

  useEffect(() => {
    if (isCommitMode) setLocal(value);
  }, [value, isCommitMode]);

  const displayValue = isCommitMode ? local : value;

  return (
    <div
      className={`flex items-center gap-1 flex-wrap text-sm ${
        classNames?.wrapper
      } ${vertical ? "flex-col gap-1!" : ""}`}
    >
      {label && (
        <label
          className={`shrink-0 w-32 ${vertical ? "self-start" : ""} ${
            sizes?.label
          }`}
        >
          {label}
        </label>
      )}

      <div
        className={`flex flex-1 gap-1 w-full justify-start sm:justify-end ${
          classNames?.inputWrapper
        } ${vertical ? "justify-start!" : ""}`}
      >
        {type === "range" && (
          <span className="text-[0.85rem] text-(--text)">
            {formatter(displayValue)}
          </span>
        )}

        <input
          {...props}
          type={type}
          value={displayValue ?? ""}
          onChange={(e) => {
            isCommitMode ? setLocal(e.target.value) : onChange?.(e);
          }}
          onBlur={(e) => {
            if (isCommitMode) onCommit(local);
            onBlur?.(e);
          }}
          className={`
            w-full rounded max-w-40 min-w-30
            bg-(--surface-muted)
            text-(--text)
            border border-(--border)
            outline-none focus:border-(--info)
            disabled:opacity-50 disabled:cursor-not-allowed
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            ${type === "range" ? "" : sizes?.input}
            ${vertical ? "max-w-full" : ""}
            ${classNames?.input}
          `}
        />
      </div>
    </div>
  );
}
