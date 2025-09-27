import { getPieChartConfig } from "@charts/apex/configs";
import React, { memo, useState } from "react";
import Chart from "react-apexcharts";

const TradePieChart = memo(({ pieChartTradeData, totalTrades, theme }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Prepare data for ApexCharts
  const series = pieChartTradeData.map((entry) => parseFloat(entry.value));
  const labels = pieChartTradeData.map((entry) => entry.name);
  const colors = pieChartTradeData.map((entry) => entry.color);

  const options = getPieChartConfig(
    activeIndex,
    setActiveIndex,
    pieChartTradeData,
    totalTrades,
    labels,
    colors
  );

  return (
    <Chart
      options={options}
      series={series}
      type="donut"
      height={220}
      width={220}
    />
  );
});

export default TradePieChart;
