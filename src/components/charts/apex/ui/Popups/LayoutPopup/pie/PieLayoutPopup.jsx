import { useMemo, useState } from "react";
import { SidePanelPopup } from "@ui";

import GeneralSection from "./sections/GeneralSection";
import PieSliceSection from "./sections/PieSliceSection";
import PieSeriesSection from "./sections/PieSeriesSection";
import CenterLabelSection from "../shared/CenterLabelsSection";
import LegendSection from "../shared/LegendSection";

export default function PieLayoutPopup(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  /* -------- Section Definitions -------- */
  const sections = useMemo(
    () => [
      { id: "general", label: "General", Comp: GeneralSection },
      { id: "slice", label: "Slice", Comp: PieSliceSection },
      { id: "series", label: "Series", Comp: PieSeriesSection },
      { id: "centerLabels", label: "Center Labels", Comp: CenterLabelSection },
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
