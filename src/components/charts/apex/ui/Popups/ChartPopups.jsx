import { useChartStore } from "@charts/apex/store/useChartStore";
import ChartLayoutPopup from "./LayoutPopup";
import AddSeriesPopup from "./ManageSeriesPopup";
import FilterPopup from "./Filter";
import SortPopup from "./Sort";

export default function ChartPopups() {
  const activePopup = useChartStore((s) => s.activePopup);
  const updateChart = useChartStore((s) => s.updateChart);

  if (activePopup === null) return null;

  switch (activePopup.id) {
    case "manage-series":
      return (
        <AddSeriesPopup
          chartId={activePopup.chartId}
          updateChart={updateChart}
        />
      );

    case "layout":
      return (
        <ChartLayoutPopup
          chartId={activePopup.chartId}
          updateChart={updateChart}
        />
      );

    case "filter":
      return <FilterPopup chartId={activePopup.chartId} />;

    case "sort":
      return <SortPopup chartId={activePopup.chartId} />;

    default:
      return null;
  }
}
