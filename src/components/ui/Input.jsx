import { useResolvedValue } from "@hooks";

const baseInputClass = `
  w-full flex-1 max-w-40
  rounded
  bg-(--surface-muted)
  text-(--text)
  border
  outline-none
  disabled:opacity-50
  disabled:cursor-not-allowed
  [appearance:textfield]
  [&::-webkit-outer-spin-button]:appearance-none
  [&::-webkit-inner-spin-button]:appearance-none
`;

export const sizeClasses = {
  sm: "px-2 py-[2px] text-xs",
  md: "px-[0.6rem] py-[0.3rem] text-[0.83rem]",
  lg: "px-4 py-3 text-mg",
};

export const variantClasses = {
  default: "border-(--border) focus:border-(--info)",
  error: "border-(--error) focus:border-(--error)",
  success: "border-(--success) focus:border-(--success)",
  ghost: "border-transparent bg-transparent",
};

export default function Input({ children, value, className = "", store }) {
  const val = useResolvedValue(store, value);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {typeof children === "function" ? children({ value: val }) : children}
    </div>
  );
}

Input.Label = ({ children, className = "" }) => (
  <label className={`text-(--text) whitespace-nowrap ${className}`}>
    {children}
  </label>
);

Input.Field = ({
  type = "text",
  size = "md",
  variant = "default",
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      {...props}
      className={`
        ${baseInputClass}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    />
  );
};

Input.Text = ({ className = "", ...props }) => {
  return <input {...props} className={`${baseInputClass}${className}`} />;
};

Input.Range = ({ size = "md", className = "", showValue = true, ...props }) => {
  return (
    <div className="flex items-center gap-2">
      {showValue && (
        <span className="text-xs text-(--muted)">{props.value}</span>
      )}
      <input type="range" {...props} className={`flex-1 ${className}`} />
    </div>
  );
};
