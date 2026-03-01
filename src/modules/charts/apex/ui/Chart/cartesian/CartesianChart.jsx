import ReactApexChart from "react-apexcharts";

export function CartesianChart() {
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
