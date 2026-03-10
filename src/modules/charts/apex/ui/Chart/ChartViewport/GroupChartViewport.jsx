import {
  useApexEffects,
  useGroupChartConfig,
} from "@modules/charts/apex/hooks";
import ReactApexChart from "react-apexcharts";

export function GroupChartViewport(props) {
  const { options, series, type } = useGroupChartConfig(props);

  useApexEffects({ ...props, type, series });

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
