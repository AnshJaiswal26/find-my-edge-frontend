import { ChartContainer } from "./ChartContainer";
import { ChartTitle } from "./ChartTitle";
import { ChartWithConfig } from "./ChartWithConfig";

export default function CustomApexChart({ chartId, type }) {
  return (
    <ChartContainer chartId={chartId}>
      <ChartTitle chartId={chartId} />
      <ChartWithConfig chartId={chartId} type={type} />
    </ChartContainer>
  );
}
