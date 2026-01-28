import { useMemo, useState } from "react";
import { SidePanelPopup } from "@ui";

import GeneralSection from "./sections/GeneralSection";
import PolarSection from "./sections/PolarSection";
import AxisLabelsSection from "./sections/AxisLabelsSection";
import LegendSection from "../shared/LegendSection";

export default function PolarAreaLayoutPopup(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const sections = useMemo(
    () => [
      { id: "general", label: "General", Comp: GeneralSection },
      { id: "polar", label: "Polar Area", Comp: PolarSection },
      { id: "axisLabels", label: "Axis Labels", Comp: AxisLabelsSection },
      { id: "legend", label: "Legend", Comp: LegendSection },
    ],
    [],
  );

  return (
    <SidePanelPopup
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
