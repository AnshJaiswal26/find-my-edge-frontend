import GeneralSection from "./sections/GeneralSection";
import PolygonSection from "./sections/PolygonSection";
import AxisLabelsSection from "./sections/AxisLabelsSection";
import LegendSection from "../common sections/LegendSection";

export default function RadarLayoutPopup(props) {
  return (
    <>
      <GeneralSection {...props} />
      <PolygonSection {...props} />
      <AxisLabelsSection {...props} />
      <LegendSection {...props} />
    </>
  );
}
