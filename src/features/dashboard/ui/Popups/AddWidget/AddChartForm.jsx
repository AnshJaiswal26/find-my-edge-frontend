import { CartesianChartForm } from "./CartesianChartForm";
import { GroupedChartForm } from "./GroupedChartForm";

export default function AddChartForm({ type, options, ref }) {
  switch (type) {
    case "bar":
    case "line":
      return <CartesianChartForm ref={ref} type={type} options={options} />;

    case "donut":
    case "radialBar":
      return <GroupedChartForm ref={ref} type={type} options={options} />;

    default:
      null;
  }
}
