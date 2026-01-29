import { CartesianChartForm } from "./CartesianChartForm";

export default function AddChartForm({ type, options, isAddClicked, ref }) {
  switch (type) {
    case "bar":
    case "line":
      return (
        <div className="space-y-4">
          <CartesianChartForm
            ref={ref}
            type={type}
            options={options}
            isAddClicked={isAddClicked}
          />
        </div>
      );

    default:
      null;
  }
}
