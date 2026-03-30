import { useDurationInput } from "@shared/hooks";
import { useRef } from "react";
import { hideTooltip, showTooltip } from "../tooltip";

const labels = ["Days", "Hrs", "Mins", "Sec"];

export default function DurationInput({
  value,
  onChange,
  onBlur,
  className = "",
  wrapperClassName = "",
}) {
  const wrapperRef = useRef(null);

  const inputRefs = useRef([]);

  const { parts, updatePart, handleArrow } = useDurationInput(
    value,
    onChange,
    inputRefs,
    labels,
  );

  const handleBlur = (e) => {
    const nextFocused = e.relatedTarget;

    // Ignore blur if focus moved to another child
    if (wrapperRef.current?.contains(nextFocused)) return;

    onBlur?.(parts.join(":"));
  };

  return (
    <div
      className={`relative flex ${wrapperClassName}`}
      ref={wrapperRef}
      onBlur={handleBlur}
    >
      {parts.map((p, index) => (
        <div key={index} className="flex flex-col relative">
          <div className="flex min-w-5 items-center">
            {index !== 0 && <span>:</span>}
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              className={`${className} outline-0 text-center !min-w-0 !w-10`}
              value={String(p).padStart(2, "0")}
              autoFocus={index === 0}
              onMouseEnter={(e) => {
                showTooltip(e, { content: labels[index] });
              }}
              onMouseLeave={hideTooltip}
              onChange={(e) => updatePart(index, e.target.value, e)}
              onKeyDown={(e) => {
                handleArrow(index, e);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
