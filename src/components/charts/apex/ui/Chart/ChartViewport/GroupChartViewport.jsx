export function GroupChartViewport(props) {
  const { options, series } = useGroupChartConfig(props);

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
