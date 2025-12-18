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
    <>
      {/* Toggle button */}
      <div>
        <button
          onClick={() => setShowOverview(!showOverview)}
          className={`
            flex gap-1 items-center
            bg-slate-50 dark:bg-slate-700
            border border-slate-200 dark:border-slate-700
            text-slate-700 dark:text-white
            text-[0.775rem]
            px-2.5 py-1
            cursor-pointer
            transition-colors
            ${showOverview ? "rounded-t-md border-b-0" : "rounded-md"}
          `}
        >
          <span className="hover:underline">
            {showOverview ? "Hide" : "See"} Overview
          </span>
          <span className="ml-1">
            <ChevronDown
              size={15}
              className={`transition-all duration-300 ${
                showOverview ? "rotate-180" : ""
              } `}
            />
          </span>
        </button>
      </div>

      {/* Collapsible wrapper */}
      <div
        className={`
          overflow-hidden
          transition-all
          duration-500
          ease-in-out
          ${
            showOverview
              ? "max-h-[500px] opacity-100 overflow-y-auto"
              : "max-h-0 opacity-0"
          }
        `}
      >
        {/* Content box */}
        <div
          className="
            bg-slate-50 dark:bg-slate-700
            border border-slate-200 dark:border-slate-700
            rounded-b-lg rounded-tr-lg
            px-4 py-3
            shadow-sm
            text-slate-800 dark:text-slate-100
          "
        >
          {/* Title */}
          <div className="text-base font-semibold mb-2 flex items-center gap-1.5 text-slate-700 dark:text-white">
            {title}
          </div>

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
                bg-blue-50 dark:bg-blue-900/40
                text-blue-900 dark:text-white
                px-3 py-2
                border-l-4 border-blue-400
                rounded-md
              "
            >
              {note}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
