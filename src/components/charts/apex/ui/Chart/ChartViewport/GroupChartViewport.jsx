import { useApexEffects, useGroupChartConfig } from "@charts/apex/hooks";
import ReactApexChart from "react-apexcharts";

export function GroupChartViewport(props) {
  const { options, series } = useGroupChartConfig(props);

  useApexEffects({ ...props, series });

  return (
    <ReactApexChart
      options={options}
      series={series}
      type={props.type}
      height="100%"
      width="100%"
    />
  );
}
