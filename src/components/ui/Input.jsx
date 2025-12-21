import { useResolvedValue } from "@hooks";

export default function Input({ children, value, className, store }) {
  const val = useResolvedValue(store, value);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {typeof children === "function" ? children({ value: val }) : children}
    </div>
  );
}

Input.Label = ({ children, className }) => {
  return (
    <label
      className={`text-(--text)
          whitespace-nowrap ${className}`}
    >
      {children}
    </label>
  );
};

Input.Field = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`
            w-full flex-1
            rounded
            bg-(--surface-muted)
            text-(--text) text-[0.83rem] 
            px-[0.6rem] py-[0.3rem]
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
  );
};
