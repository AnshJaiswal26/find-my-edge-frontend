import { useDurationInput } from "@shared/hooks";

export default function DurationInput({
  value,
  onChange,
  onBlur,
  className = "",
  ...props
}) {
  const durationInput = useDurationInput(value || "", onChange);

  const handleBlur = (e) => {
    const val = durationInput.value; // correct value
    onBlur?.(val, e); // pass value + event
  };

  return (
    <input
      {...props}
      ref={durationInput.ref}
      className={className}
      autoFocus
      type="text"
      value={durationInput.value}
      onChange={durationInput.onChange}
      onKeyDown={durationInput.onKeyDown}
      onBlur={handleBlur}
    />
  );
}
