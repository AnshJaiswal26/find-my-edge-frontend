export default function Badge({ value, label, formatter, className = "" }) {
  const v = Number(value);
  const formattedValue = formatter ? formatter(v) : v;

  const variant =
    v > 0
      ? "bg-(--success-soft) text-(--success) border border-(--success)"
      : v === 0
        ? "bg-(--warning) text-(--warning) border border-(--warning)"
        : "bg-(--error-soft) text-(--error) border border-(--error)";

  return (
    <div className="flex gap-1.5 items-center">
      {label && <span>{label}</span>}

      <span
        className={`
          rounded-full
          px-[6px] py-[3px]
          text-[0.88rem]
          ${variant}
          ${className}
        `}
      >
        {formattedValue}
      </span>
    </div>
  );
}
