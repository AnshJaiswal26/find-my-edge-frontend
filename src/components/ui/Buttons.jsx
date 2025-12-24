import { useEffect, useState } from "react";

const sizeClasses = {
  large: "px-3 py-2 text-lg rounded-lg",
  medium: "px-2.5 py-1 text-md rounded-md",
  small: "px-2 py-1 text-sm rounded-sm",
};

const typeClasses = {
  hollow: "bg-inherit hover:text-white",
  fill: "text-white",
};

const variantClasses = {
  success: "hover:bg-(--success) border-(--success) text-(--sucess)",
  error: "hover:bg-(--error) border-(--error) text-(--error)",
  wraning: "hover:bg-(--wraning) border-(--wraning) text-(--wraning)",
  info: "hover:bg-(--info) border-(--info) text-(--info)",
  cyan: "hover:bg-(--cyan) border-(--cyan) text-(--cyan)",
};

export const Button = ({
  text,
  hollow = false,
  size = "medium",
  variant = "cyan",
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <div className="flex">
      <button
        style={{ backgroundColor: hollow ? "" : `var(--${variant})` }}
        {...props}
        className={`
          font-[500]
          select-none
          cursor-pointer
          border
          ${sizeClasses[size]}
          ${typeClasses[hollow ? "hollow" : "fill"]}
          ${variantClasses[variant]}
          ${disabled ? "opacity-40 pointer-events-none" : ""}
          ${className}
        `}
      >
        <span>{text}</span>
      </button>
    </div>
  );
};

Button.Toggle = ({
  label,
  value,
  onChange,
  onCommit,
  classNames = {},
  ...props
}) => {
  const isCommitMode = typeof onCommit === "function";
  const [local, setLocal] = useState(value);

  useEffect(() => {
    if (isCommitMode) setLocal(value);
  }, [value, isCommitMode]);

  const active = isCommitMode ? local : value;

  const handleToggle = () => {
    const next = !active;

    if (isCommitMode) {
      setLocal(next);
      onCommit(next);
    } else {
      onChange?.(next);
    }
  };

  return (
    <div
      className={`flex items-center gap-2 justify-between text-sm ${classNames?.wrapper}`}
    >
      {label && <span>{label}</span>}

      <div
        role="switch"
        aria-checked={active}
        onClick={handleToggle}
        className={`
          cursor-pointer
          w-8 h-3
          rounded-full
          flex items-center
          transition-colors
          ${classNames?.track}
          ${active ? "bg-(--info)" : "bg-(--hover)"}
        `}
        {...props}
      >
        <div
          className={`
            w-4 h-4
            bg-white
            rounded-full
            transition-transform
            border
            ${classNames?.thumb}
            ${
              active
                ? "translate-x-full border-(--info)"
                : "translate-x-0 border-(--border)"
            }
          `}
        />
      </div>
    </div>
  );
};

Button.Icon = ({ className = "", tooltip, disabled, children, ...props }) => {
  return (
    <button
      data-tooltip={tooltip?.text}
      data-tooltip-position={tooltip?.position}
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
          text-(--text)
          ${disabled ? "opacity-40 pointer-events-none" : ""}
          ${className}
        `}
      {...props}
    >
      {children}
    </button>
  );
};
