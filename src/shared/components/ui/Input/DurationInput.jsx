import { useDurationInput } from "@shared/hooks";
import { createPortal } from "react-dom";

export default function DurationInput({
  value,
  onChange,
  onBlur,
  className = "!min-w-14 w-10 text-center",
  wrpperClassName = "flex gap-2",
  guide = true,
}) {
  const duration = useDurationInput(value || "", onChange);

  const { parts, updatePart, handleArrow } = duration;

  const labels = ["Days", "Hrs", "Mins", "Sec"];

  return (
    <div className={`${wrpperClassName} ${guide ? "mt-2.5" : ""}`}>
      {parts.map((p, index) => (
        <div className={`flex flex-col relative`}>
          {guide && (
            <span
              className={`text-[11px] text-center opacity-60 absolute -top-4 left-3 -translate-x-1/2 mt-0.5 whitespace-nowrap z-50`}
            >
              {labels[index]}
            </span>
          )}
          <input
            key={index}
            className={`${className} !min-w-0 !w-10`}
            type="text"
            value={p}
            maxLength={2}
            autoFocus={index === 0}
            onChange={(e) => updatePart(index, e.target.value, e)}
            onKeyDown={(e) => handleArrow(index, e)}
            onBlur={(e) => onBlur?.(duration.value, e)}
          />
        </div>
      ))}
    </div>
  );
}
