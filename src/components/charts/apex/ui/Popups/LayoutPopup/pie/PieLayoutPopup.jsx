// --- Sub-sections ---
import GeneralSection from "./sections/GeneralSection";
import DataLabelSection from "./sections/DataLabelsSection";
import PieSliceSection from "./sections/PieSliceSection";
import LegendSection from "../common sections/LegendSection";

export default function PieLayoutPopup(props) {
  return (
    <>
      <GeneralSection {...props} />
      <PieSliceSection {...props} />
      <DataLabelSection {...props} />
      <LegendSection {...props} />
    </>
  );
}
