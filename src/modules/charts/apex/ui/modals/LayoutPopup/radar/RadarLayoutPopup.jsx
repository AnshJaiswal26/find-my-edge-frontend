import { useMemo, useState } from "react";
import { PopupSideList } from "@shared/components/ui";

import GeneralSection from "./sections/GeneralSection";
import PolygonSection from "./sections/PolygonSection";
import AxisLabelsSection from "./sections/AxisLabelsSection";
import LegendSection from "../shared/LegendSection";

export default function RadarLayoutPopup(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const sections = useMemo(
    () => [
      { id: "general", label: "General", Comp: GeneralSection },
      { id: "polygon", label: "Polygon", Comp: PolygonSection },
      { id: "axisLabels", label: "Axis Labels", Comp: AxisLabelsSection },
      { id: "legend", label: "Legend", Comp: LegendSection },
    ],
    [],
  );

  return (
    <PopupSideList
      items={sections}
      activeIndex={activeIndex}
      onSelectIndex={setActiveIndex}
      getLabel={(s) => s.label}
      getKey={(s) => s.id}
      renderDetails={(section) => {
        const Comp = section.Comp;
        return <Comp {...props} />;
      }}
    />
  );
}
