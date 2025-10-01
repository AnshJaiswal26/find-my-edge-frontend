import React, { memo, useMemo, useEffect } from "react";
import Chart from "react-apexcharts";
import "../Dashboard.css";
import { customTooltip, getBarChartConfig } from "@charts/apex/configs";

const SetupBarChart = memo(({ data, totalTrades, isSidebarOpen, theme }) => {
  const tradeColors = data.map((item) => item.color);
  const accuracyColors = data.map((item) =>
    item.color.length === 7 ? `${item.color}ff` : item.color
  );

  const customTooltipCallback = (seriesValue, index) => {
    const tradePercentage = seriesValue[0];
    const accuracy = seriesValue[1];

    const tradeColor = tradeColors[index];
    const accuracyColor = accuracyColors[index];

    const tradeValue = totalTrades * (tradePercentage / 100);
    const accuracyValue = (accuracy / 100) * tradeValue;
    return {
      title: data[index].name,
      dataArray: [
        {
          label: "Trade: ",
          value: `${tradePercentage}% (${tradeValue} trades)`,
          color: tradeColor,
        },
        {
          label: "Accuracy: ",
          value: `${accuracy}% (${accuracyValue} wins)`,
          color: accuracyColor,
        },
      ],
    };
  };

  const options = useMemo(
    () =>
      getBarChartConfig({
        horizontal: true,
        xaxis: {
          categories: data.map((item) => item.name),
          labels: { formatter: (value) => value + "%" },
          max: 100,
        },
        customTooltipCallback,
        barColors: [
          ({ seriesIndex, dataPointIndex: i }) =>
            seriesIndex === 0 ? tradeColors[i] : accuracyColors[i],
        ],
        dataLabels: {
          style: { fontSize: "13px" },
          formatter: (val) => `${val}%`,
        },
      }),
    []
  );

  const series = useMemo(
    () => [
      { data: data.map((item) => parseFloat(item.percentage)) },
      { data: data.map((item) => parseFloat(item.Accuracy)) },
    ],
    [data]
  );

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  }, [isSidebarOpen]);

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={320}
      width={"100%"}
    />
  );
});

export default SetupBarChart;
