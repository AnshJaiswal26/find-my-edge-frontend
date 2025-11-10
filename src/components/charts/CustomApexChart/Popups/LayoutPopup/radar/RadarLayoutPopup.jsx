import GeneralSection from "./sections/GeneralSection";
import PolygonSection from "./sections/PolygonSection";
import EdgeLabelsSection from "./sections/EdgeLabelsSection";
import AxisLabelsSection from "./sections/AxisLabelsSection";
import LegendSection from "../common sections/LegendSection";

export default function RadarLayoutPopup({ chartId, updateChart }) {
  return (
    <>
      <GeneralSection chartId={chartId} updateChart={updateChart} />
      <PolygonSection chartId={chartId} updateChart={updateChart} />
      <EdgeLabelsSection chartId={chartId} updateChart={updateChart} />
      <AxisLabelsSection chartId={chartId} updateChart={updateChart} />
      <LegendSection chartId={chartId} updateChart={updateChart} />
    </>
  );
}
