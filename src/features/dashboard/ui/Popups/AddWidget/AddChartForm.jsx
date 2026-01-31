import { CartesianChartForm } from "./CartesianChartForm";
import { GroupedChartForm } from "./GroupedChartForm";

export default function AddChartForm({ type, options, ref, schemasById }) {
  switch (type) {
    case "bar":
    case "line":
      return (
        <CartesianChartForm
          ref={ref}
          type={type}
          options={options}
          schemasById={schemasById}
        />
      );

    case "donut":
    case "radialBar":
      return (
        <GroupedChartForm
          ref={ref}
          type={type}
          options={options}
          schemasById={schemasById}
        />
      );

    default:
      null;
  }
}
