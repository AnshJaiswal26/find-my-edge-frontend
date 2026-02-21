import {
  useApexEffects,
  useSeriesChartConfig,
} from "@modules/charts/apex/hooks";
import ReactApexChart from "react-apexcharts";

export function SeriesChartViewport(props) {
  const { options, series } = useSeriesChartConfig(props);

  const type = props.layout.area && props.type === "line" ? "area" : props.type;

  useApexEffects({ ...props, series });

  return (
    <ReactApexChart
      options={options}
      series={series}
      type={type}
      height="100%"
      width="100%"
    />
  );
}
