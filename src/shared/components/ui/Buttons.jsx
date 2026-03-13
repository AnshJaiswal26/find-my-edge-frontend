import { Loader2 } from "lucide-react";
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

export default function Button({
  text,
  hollow = false,
  size = "medium",
  variant = "cyan",
  classNames = {},
  disabled = false,
  loading = false,
  ...props
}) {
  return (
    <div className={`flex ${classNames?.wrapper || ""}`}>
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
          ${classNames?.button || ""}
          ${loading ? "flex items-center gap-2" : ""}
        `}
      >
        {loading && (
          <Loader2 size={18} className="animate-spin" color="var(--text)" />
        )}
        <span>{text}</span>
      </button>
    </div>
  );
}

Button.Toggle = ({
  label,
  hint,
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
      className={`
        flex items-center justify-between gap-4 text-sm
        ${classNames?.wrapper || ""}
      `}
    >
      {(label || hint) && (
        <div>
          {label && <div className="text-sm">{label}</div>}
          {hint && <div className="text-xs text-(--text-disabled)">{hint}</div>}
        </div>
      )}

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
          ${classNames?.track || ""}
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
            ${classNames?.thumb || ""}
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

Button.Text = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        text-sm text-(--text) underline underline-offset-4 hover:text-(--info) transition
        ${disabled ? "opacity-40 pointer-events-none" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
