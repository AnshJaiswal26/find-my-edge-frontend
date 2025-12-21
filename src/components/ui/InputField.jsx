import { useResolvedValue } from "@hooks";

const sizeClasses = {
  large: {
    label: "text-sm",
    input: "px-3 py-2 text-sm",
  },
  medium: {
    label: "text-[0.83rem]",
    input: "px-[0.6rem] py-[0.3rem] text-[0.83rem]",
  },
  small: {
    label: "text-[0.8rem]",
    input: "px-[0.55rem] py-[0.25rem] text-[0.8rem]",
  },
};

export default function InputField({
  label,
  size = "large",
  labelPosition = "left", // left | top
  type = "text",
  value,
  onChange,
  onBlur,
  onKeyDown,
  max,
  min,
  step = 1,
  placeholder = "",
  formatter = (v) => v,
  className = "",
  store,
}) {
  const val = useResolvedValue(store, value);
  const sizes = sizeClasses[size];

  return (
    <div
      className={`
        flex gap-4 justify-between!
        ${
          labelPosition === "top"
            ? "flex-col items-start gap-1"
            : "items-center"
        }
      `}
    >
      {/* Label */}
      <label
        className={`
          ${sizes.label}
          text-(--text)
          whitespace-nowrap
        `}
      >
        {label}
      </label>

      {/* Input wrapper */}
      <div className="flex justify-end items-center gap-2 w-full">
        {type === "range" && (
          <span className="text-[0.85rem] text-(--text)">{formatter(val)}</span>
        )}

        <input
          type={type}
          value={val}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onKeyDown={(e) => onKeyDown?.(e)}
          onBlur={(e) => onBlur?.(e)}
          onChange={(e) =>
            onChange?.(
              type === "number" ? Number(e.target.value) : e.target.value,
              e
            )
          }
          className={`
            w-full flex-1
            ${type === "range" ? "" : sizes.input}
            rounded
            max-w-40
            bg-(--surface-muted)
            text-(--text) 
            border border-(--border)
            outline-none
            focus:border-(--info)
            disabled:opacity-50
            disabled:cursor-not-allowed
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            ${className}
          `}
        />
      </div>
    </div>
  );
}

// import { useResolvedValue } from "@hooks";

// const sizeClasses = {
//   large: {
//     label: "text-sm",
//     input: "px-3 py-2 text-sm",
//   },
//   medium: {
//     label: "text-[0.83rem]",
//     input: "px-[0.6rem] py-[0.3rem] text-[0.83rem]",
//   },
//   small: {
//     label: "text-[0.8rem]",
//     input: "px-[0.55rem] py-[0.25rem] text-[0.8rem]",
//   },
// };
