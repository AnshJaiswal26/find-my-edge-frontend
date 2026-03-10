import { AxisSeriesChartViewport } from "./AxisSeriesChartViewport";
import { GroupChartViewport } from "./GroupChartViewport";
import { CartesianChartViewport } from "./CartesianChartViewport";

export const ViewPort = (props) => {
  switch (props.category) {
    case "group":
      return <GroupChartViewport {...props} />;
    case "axis-series":
      return <AxisSeriesChartViewport {...props} />;
    default:
      return <CartesianChartViewport {...props} />;
  }
};
