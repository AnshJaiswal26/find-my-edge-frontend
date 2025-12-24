import GeneralSection from "./sections/GeneralSection";
import DataLabelSection from "./sections/DataLabelsSection";
import TrackSection from "./sections/TrackSection";
import BarSection from "./sections/RadialBarSection";
import LegendSection from "../common sections/LegendSection";

export default function RadialLayoutPopup(props) {
  return (
    <>
      <GeneralSection {...props} />
      <TrackSection {...props} />
      <BarSection {...props} />
      <DataLabelSection {...props} />
      <LegendSection {...props} />
    </>
  );
}
