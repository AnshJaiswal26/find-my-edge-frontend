import { InputField } from "./InputField";

const sizeClasses = {
  sm: {
    input: "h-7 px-2 text-xs",
    label: "text-xs",
  },
  md: {
    input: "h-8 px-2 text-sm",
    label: "text-sm",
  },
  lg: {
    input: "h-9 px-3 text-base",
    label: "text-base",
  },
};

/* =========================================================
 * MAIN INPUT WRAPPER
 * ========================================================= */

export default function Input({
  size = "md",
  type = "text",
  value,
  label,
  vertical = false,
  onChange,
  onCommit,
  onBlur,
  formatter = (v) => v,
  classNames,
  ...props
}) {
  const sizes = sizeClasses[size];

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
        <InputField
          value={value}
          sizes={sizes}
          type={type}
          onChange={onChange}
          onCommit={onCommit}
          onBlur={onBlur}
          formatter={formatter}
          classNames={classNames}
          {...props}
        />
      </div>
    </div>
  );
}
