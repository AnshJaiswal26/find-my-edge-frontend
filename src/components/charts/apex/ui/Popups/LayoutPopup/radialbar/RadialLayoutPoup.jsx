import { useMemo, useState } from "react";
import { SidePanelPopup } from "@ui";

import GeneralSection from "./sections/GeneralSection";
import TrackSection from "./sections/TrackSection";
import RadialBarSection from "./sections/RadialBarSection";
import RadialBarSeriesSection from "./sections/RadialBarSeriesSection";
import CenterLabelSection from "../shared/CenterLabelsSection";
import LegendSection from "../shared/LegendSection";

export default function RadialLayoutPopup(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  /* -------- Section Definitions -------- */
  const sections = useMemo(
    () => [
      { id: "general", label: "General", Comp: GeneralSection },
      { id: "track", label: "Track", Comp: TrackSection },
      { id: "radialbar", label: "Radial Bar", Comp: RadialBarSection },
      { id: "series", label: "Series", Comp: RadialBarSeriesSection },
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
