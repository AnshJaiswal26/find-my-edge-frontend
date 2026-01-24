import { useMemo, useState } from "react";

import GeneralSection from "./sections/GeneralSection";
import TrackSection from "./sections/TrackSection";
import RadialBarSection from "./sections/RadialBarSection";
import RadialBarSeriesSection from "./sections/RadialBarSeriesSection";
import CenterLabelSection from "../shared/CenterLabelsSection";
import LegendSection from "../shared/LegendSection";

export default function RadialLayoutPopup(props) {
  const [active, setActive] = useState("general");

  const sectionMap = useMemo(() => {
    return {
      general: GeneralSection,
      track: TrackSection,
      bar: RadialBarSection,
      series: RadialBarSeriesSection,
      centerLabels: CenterLabelSection,
      legend: LegendSection,
    };
  }, []);

  const ActiveSection = sectionMap[active];

  return (
    <div className="flex h-full">
      {/* ---------- LEFT NAV ---------- */}
      <div className="w-30 border-r border-(--border-muted) space-y-1">
        {[
          ["general", "General"],
          ["track", "Track"],
          ["bar", "Bar"],
          ["series", "Series"],
          ["centerLabels", "Center Labels"],
          ["legend", "Legend"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`
              w-full text-left px-3 py-2 text-sm
              transition
              ${
                active === id
                  ? "bg-(--hover) text-(--text)"
                  : "text-(--text-muted) hover:bg-(--surface-muted)"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------- RIGHT CONTENT ---------- */}
      <div className="flex-1 p-3 overflow-y-auto">
        {ActiveSection ? (
          <ActiveSection {...props} />
        ) : (
          <div className="text-(--text-muted) text-sm">
            No settings available.
          </div>
        )}
      </div>
    </div>
  );
}
