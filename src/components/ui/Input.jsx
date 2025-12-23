import { useResolvedValue } from "@hooks";

const sizeClasses = {
  lg: {
    label: "text-lg",
    input: "px-4 py-2 text-lg",
  },

  md: {
    label: "text-sm",
    input: "px-3 py-2 text-sm",
  },
  sm: {
    label: "text-[0.87rem]",
    input: "px-[0.6rem] py-[0.3rem] text-[0.87rem]",
  },
};

export default function Input({
  label,
  size = "md",
  type = "text",
  vertical = false,
  value,
  formatter = (v) => v,
  onChange,
  classNames,
  store,
  ...props
}) {
  const val = useResolvedValue(store, value);
  const sizes = sizeClasses[size];

  return (
    <div
      className={`flex items-center gap-1 flex-wrap text-sm ${
        classNames?.wrapper
      } ${vertical ? "flex-col gap-1!" : ""}`}
    >
      {label && (
        <label className={`shrink-0 w-32 ${vertical ? "self-start" : ""}`}>
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div
        className={`flex flex-1 w-full justify-start sm:justify-end ${
          classNames?.inputWrapper
        } ${vertical ? "justify-start!" : ""}`}
      >
        {type === "range" && (
          <span className="text-[0.85rem] text-(--text)">{formatter(val)}</span>
        )}

        <input
          {...props}
          value={val}
          type={type}
          onChange={(e) => onChange?.(e)}
          className={`
            w-full 
            rounded
            max-w-40
            min-w-30
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
            ${type === "range" ? "" : sizes.input}
            ${vertical ? "max-w-full" : ""}
            ${classNames?.input}
          `}
        />
      </div>
    </div>
  );
}
