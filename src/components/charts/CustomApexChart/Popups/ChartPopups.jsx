import { useChartStore } from "@stores";
import ChartLayoutPopup from "./LayoutPopup";
import AddSeriesPopup from "./ManageSeriesPopup";

export default function ChartPopups() {
  const activeChart = useChartStore((s) => s.activeChart);
  const updateChart = useChartStore((s) => s.updateChart);

  if (activeChart.activePopup === null) return null;

  return activeChart.activePopup === "ManageSeries" ? (
    <AddSeriesPopup
      chartId={activeChart.id}
      type={activeChart.type}
      updateChart={updateChart}
    />
  ) : (
    <ChartLayoutPopup
      chartId={activeChart.id}
      type={activeChart.type}
      updateChart={updateChart}
    />
  );
}
