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
import { PopupSideList } from "@shared/components/ui";

export default function CartesianLayoutPopup(props) {
  const { type, chart } = props;
  const isHorizontal = chart.layout.horizontal;

  const [activeIndex, setActiveIndex] = useState(0);

  const sections = useMemo(() => {
    const base = [
      { id: "general", label: "General", Comp: GeneralSection },
      { id: "grid", label: "Grid", Comp: GridSection },
    ];

    if (type === "bar") {
      base.push(
        { id: "bar", label: "Bar", Comp: BarSection },
        { id: "series", label: "Series", Comp: BarSeriesSection },
      );
    }

    if (type === "line") {
      base.push(
        { id: "line", label: "Line", Comp: LineSection },
        { id: "series", label: "Series", Comp: LineSeriesSection },
      );
    }

    base.push(
      {
        id: "xAxis",
        label: isHorizontal ? "Y Axis" : "X Axis",
        Comp: XAxisSection,
      },
      {
        id: "yAxis",
        label: !isHorizontal ? "Y Axis" : "X Axis",
        Comp: YAxisSection,
      },
      { id: "legend", label: "Legend", Comp: LegendSection },
    );

    return base;
  }, [type, isHorizontal]);

  return (
    <PopupSideList
      items={sections}
      activeIndex={activeIndex}
      onSelectIndex={setActiveIndex}
      getLabel={(s) => s.label}
      getKey={(s) => s.id}
      renderDetails={(section) => {
        const Comp = section.Comp;
        return <Comp {...props} isHorizontal={isHorizontal} />;
      }}
    />
  );
}
