import { useMemo, useState } from "react";

import {
  GeneralSection,
  XAxisSection,
  YAxisSection,
  GridSection,
} from "./sections";
import { BarSection, BarSeriesSection } from "./sections/bar";
import { LineSection, LineSeriesSection } from "./sections/line";
import LegendSection from "../shared/LegendSection";

export default function CartesianLayoutPopup(props) {
  const { type, chart } = props;
  const isHorizontal = chart.layout.horizontal;

  const [active, setActive] = useState("general");

  const sectionMap = useMemo(() => {
    return {
      general: GeneralSection,
      grid: GridSection,

      ...(type === "bar" && {
        bar: BarSection,
        series: BarSeriesSection,
      }),

      ...(type === "line" && {
        line: LineSection,
        series: LineSeriesSection,
      }),

      xAxis: XAxisSection,
      yAxis: YAxisSection,
      legend: LegendSection,
    };
  }, [type]);

  const ActiveSection = sectionMap[active];

  return (
    <div className="flex h-full">
      {/* LEFT NAV */}
      <div className="w-30 border-r border-(--border-muted) space-y-1">
        {[
          ["general", "General"],
          ["grid", "Grid"],
          ...(type === "bar"
            ? [
                ["bar", "Bar"],
                ["series", "Series"],
              ]
            : []),
          ...(type === "line"
            ? [
                ["line", "Line"],
                ["series", "Series"],
              ]
            : []),
          ["xAxis", "X Axis"],
          ["yAxis", "Y Axis"],
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

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-3 overflow-y-auto">
        {ActiveSection ? (
          <ActiveSection {...props} isHorizontal={isHorizontal} />
        ) : (
          <div className="text-(--text-muted) text-sm">
            No settings available.
          </div>
        )}
      </div>
    </div>
  );
}
