export function AxisSeriesChartViewport(props) {
  const { options, series } = useAxisSeriesChartConfig(props);

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
