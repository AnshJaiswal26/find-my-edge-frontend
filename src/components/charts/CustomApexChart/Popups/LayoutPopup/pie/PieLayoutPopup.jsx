// --- Sub-sections ---
import GeneralSection from "./sections/GeneralSection";
import DataLabelSection from "./sections/DataLabelsSection";
import PieSliceSection from "./sections/PieSliceSection";
import LegendSection from "../common sections/LegendSection";

export default function PieLayoutPopup({ chartId, updateChart }) {
  return (
    <>
      <GeneralSection chartId={chartId} updateChart={updateChart} />
      <PieSliceSection chartId={chartId} updateChart={updateChart} />
      <DataLabelSection chartId={chartId} updateChart={updateChart} />
      <LegendSection chartId={chartId} updateChart={updateChart} />
    </>
  );
}
