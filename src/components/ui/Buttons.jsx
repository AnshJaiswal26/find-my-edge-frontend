import { useResolvedValue } from "@hooks";

const sizeClasses = {
  large: "px-3 py-[5px] text-base",
  medium: "px-2.5 py-1 text-[0.85rem]",
  small: "px-2 py-[3px] text-xs",
};

export const Button = ({
  text,
  color,
  onClick,
  size = "medium",
  title,
  disabled = false,
  className = "",
}) => {
  return (
    <div className="flex">
      <button
        type="button"
        title={title}
        disabled={disabled}
        onClick={() => onClick?.()}
        style={color ? { backgroundColor: color } : undefined}
        className={`
          rounded-[4px]
          font-bold
          cursor-pointer
          ${sizeClasses[size]}
          text-white
          ${
            disabled
              ? "bg-(--surface-disabled) text-(--text-disabled) pointer-events-none"
              : "bg-(--cyan)"
          }
          active:brightness-90
          active:contrast-125
          active:saturate-125
          ${className}
        `}
      >
        <span>{text}</span>
      </button>
    </div>
  );
};

export const ToggleButton = ({
  label = "",
  value = false,
  color,
  onClick,
  className = "",
  store,
}) => {
  const toggleOn = useResolvedValue(store, value);

  const trackColor = toggleOn
    ? { backgroundColor: color || "var(--info)" }
    : {};

  const borderColor = toggleOn ? color || "var(--info)" : "#cccccc";

  return (
    <div
      className={`flex items-center gap-2 flex-wrap justify-between ${className}`}
    >
      {label && <span className="text-sm text-(--text)">{label}</span>}

      <div
        className="
          cursor-pointer
          w-[33px] min-w-[33px]
          h-[13px]
          rounded-full
          flex items-center
          bg-(--hover)
          transition-colors duration-200
        "
        style={trackColor}
        onClick={() => onClick?.()}
      >
        <div
          className={`
            w-[17px] h-[17px]
            bg-white
            rounded-full transition-all duration-200
            ${toggleOn ? "translate-x-full" : "translate-x-0"}
          `}
          style={{ border: `1px solid ${borderColor}` }}
        />
      </div>
    </div>
  );
};

export const IconButton = ({
  onClick,
  icon,
  src,
  alt,
  className = "",
  disabled = false,
  tooltipContent,
  tooltipPosition = "top",
}) => {
  return (
    <div
      className="relative w-fit"
      data-tooltip-position={tooltipPosition}
      data-tooltip={tooltipContent}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => (onClick ? onClick(e) : null)}
        className={`
          bg-transparent
          border-0
          cursor-pointer
          flex items-center justify-center
          box-border
          h-fit w-fit
          p-2
          rounded-[5px]
          hover:bg-(--hover)
          ${disabled ? "pointer-events-none text-(--text-disabled)" : ""}
          ${className}
        `}
      >
        {icon ? (
          <span className="w-5 h-5 flex items-center justify-center">
            {icon}
          </span>
        ) : (
          <img
            src={src}
            alt={alt ?? "icon button"}
            className="max-w-[20px] max-h-[20px] dark:invert"
          />
        )}
      </button>
    </div>
  );
};
