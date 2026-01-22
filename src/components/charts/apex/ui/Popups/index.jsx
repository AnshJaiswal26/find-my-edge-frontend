import { useChartStore } from "@charts/apex/store/useChartStore";
import ChartLayoutPopup from "./LayoutPopup";
import FilterPopup from "./Filter";
import SortPopup from "./Sort";

export default function ChartPopups() {
  const activePopup = useChartStore((s) => s.activePopup);

  if (activePopup === null) return null;

  switch (activePopup.id) {
    case "layout":
      return <ChartLayoutPopup chartId={activePopup.chartId} />;

    case "filter":
      return <FilterPopup chartId={activePopup.chartId} />;

    case "sort":
      return <SortPopup chartId={activePopup.chartId} />;

    default:
      return null;
  }
}
