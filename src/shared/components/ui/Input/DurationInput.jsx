import { useDurationInput } from "@shared/hooks";

export default function DurationInput({
  value,
  onChange,
  onBlur,
  className = "!min-w-14 w-10 text-center",
  wrpperClassName = "flex gap-2",
  guide = true,
}) {
  const { parts, updatePart, handleArrow } = useDurationInput(value, onChange);

  const labels = ["Days", "Hrs", "Mins", "Sec"];

  return (
    <div className={`${wrpperClassName} ${guide ? "mt-2.5" : ""}`}>
      {parts.map((p, index) => (
        <div key={index} className="flex flex-col relative">
          {guide && (
            <span className="text-[11px] text-center opacity-60 absolute -top-4 left-3 -translate-x-1/2 whitespace-nowrap">
              {labels[index]}
            </span>
          )}

          <input
            className={`${className} !min-w-0 !w-10`}
            value={p}
            // maxLength={2}
            onChange={(e) => updatePart(index, e.target.value, e)}
            onKeyDown={(e) => handleArrow(index, e)}
            onBlur={(e) => onBlur?.(parts.join(":"), e)}
          />
        </div>
      ))}
    </div>
  );
}
