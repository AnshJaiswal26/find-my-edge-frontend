import { useChartStore } from "@stores";
import CartesianLayoutPopup from "./cartesian/CartesianLayoutPopup";
import RadialLayoutPopup from "./radialbar/RadialLayoutPoup";
import PieLayoutPopup from "./pie/PieLayoutPopup";

export default function ChartLayoutPopup() {
  const activeChart = useChartStore((s) => s.activeChart);
  if (activeChart.id === "") return null;

  return activeChart.type === "radialBar" ? (
    <RadialLayoutPopup chartId={activeChart.id} />
  ) : activeChart.type === "donut" ? (
    <PieLayoutPopup chartId={activeChart.id} />
  ) : (
    <CartesianLayoutPopup chartId={activeChart.id} type={activeChart.type} />
  );
}
