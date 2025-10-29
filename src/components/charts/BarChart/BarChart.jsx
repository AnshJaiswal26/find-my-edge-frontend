import CartesianChart from "../CartesianChart/CartesianChart";

export default function BarChart({ chartId }) {
  return <CartesianChart chartId={chartId} type="bar" />;
}
