import { useChartStore } from "@stores";
import BarChartLayoutPopup from "./BarChartLayoutPopup";

export default function ChartLayoutPopup() {
  const activeChart = useChartStore((s) => s.charts.activeChart);
  if (activeChart.id === "") return null;

  return (
    activeChart.type === "bar" && (
      <BarChartLayoutPopup chartId={activeChart.id} />
    )
  );
}
