import { useChartStore } from "@stores";
import CartesianLayoutPopup from "./cartesian/CartesianLayoutPopup";

export default function ChartLayoutPopup() {
  const activeChart = useChartStore((s) => s.charts.activeChart);
  if (activeChart.id === "") return null;

  return (
    activeChart.type === "bar" && (
      <CartesianLayoutPopup chartId={activeChart.id} type={activeChart.type} />
    )
  );
}
