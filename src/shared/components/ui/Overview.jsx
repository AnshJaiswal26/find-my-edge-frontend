import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Overview({
  title,
  pointsArray,
  withNote = false,
  note,
}) {
  const [showOverview, setShowOverview] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Header (clickable) */}
      <div
        onClick={() => setShowOverview(!showOverview)}
        className={`
          flex items-center justify-between
          bg-(--surface-light)
          px-3 py-2
          rounded-md
          cursor-pointer
          transition-all duration-500
          border border-(--border) 
          ${showOverview ? "rounded-b-none" : ""}
        `}
      >
        {/* Title */}
        <div className="text-sm font-medium text-(--text-muted)">{title}</div>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            showOverview ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Collapsible wrapper */}
      <div
        className={`
          overflow-hidden
          transition-all
          duration-500
          ease-in-out
          border-x border-b border-(--border)
          rounded-b-md
          ${
            showOverview
              ? "max-h-[500px] opacity-100 overflow-y-auto"
              : "max-h-0 opacity-0"
          }
        `}
      >
        {/* Content */}
        <div
          className="
            bg-(--surface-light)
            rounded-b-lg
            p-2
            shadow-sm
            text-(--text)
          "
        >
          {/* Points */}
          <ul className="pl-5 text-sm leading-relaxed">
            {pointsArray.map((point, idx) => (
              <li key={idx} className="mb-1.5">
                {point}
              </li>
            ))}
          </ul>

          {/* Optional note */}
          {withNote && (
            <div
              className="
                mt-3
                text-[13.5px]
                leading-relaxed
                bg-(--info-soft)
                text-(--info)
                px-3 py-2
                border-l-4 border-(--info)
                rounded-md
              "
            >
              {note}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
