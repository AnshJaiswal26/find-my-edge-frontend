import { CartesianChartForm } from "./CartesianChartForm";
import { GroupedChartForm } from "./GroupedChartForm";

export default function AddChartForm(props) {
  switch (props.type) {
    case "bar":
    case "line":
      return <CartesianChartForm {...props} />;

    case "donut":
    case "radialBar":
      return <GroupedChartForm {...props} />;

    default:
      null;
  }
}
