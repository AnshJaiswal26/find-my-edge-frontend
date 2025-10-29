import CartesianChart from "../CartesianChart/CartesianChart";

export default function LineChart({ chartId }) {
  return <CartesianChart chartId={chartId} type="line" />;
}
