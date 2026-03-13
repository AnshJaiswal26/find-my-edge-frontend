import { useChartStore } from "@modules/charts/apex/store";
import ChartLayoutPopup from "./LayoutPopup";
import FilterPopup from "./FilterPopup";
import SortPopup from "./SortPopup.jsx.jsx";

export default function ChartPopups(props) {
  const activePopup = useChartStore((s) => s.activePopup);

  if (activePopup === null) return null;

  switch (activePopup.id) {
    case "layout":
      return <ChartLayoutPopup chartId={activePopup.chartId} />;

    case "filter":
      return <FilterPopup chartId={activePopup.chartId} {...props} />;

    case "sort":
      return <SortPopup chartId={activePopup.chartId} {...props} />;

    default:
      return null;
  }
}
