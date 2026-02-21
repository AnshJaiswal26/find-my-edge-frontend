import { useRadarChartConfig } from "@modules/charts/apex/hooks";
import ReactApexChart from "react-apexcharts";

function RadarChartViewport(props) {
  const { options, series } = useRadarChartConfig(props);
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

export function AxisSeriesChartViewport(props) {
  switch (props.type) {
    case "radar":
      return <RadarChartViewport {...props} />;
    case "polarArea":
      // return <PolarAreaChartViewport {...props} />;
      break;

    default:
      break;
  }
}
