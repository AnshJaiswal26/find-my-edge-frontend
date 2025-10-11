import React, { memo, useMemo, useEffect } from "react";
import "../Dashboard.css";
import { BarChart } from "@charts";

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

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);
  }, [isSidebarOpen]);

  return (
    // <BarChart
    //   series={[
    //     data.map((i) => parseInt(i.percentage)),
    //     data.map((i) => parseInt(i.Accuracy)),
    //   ]}
    //   categories={data.map((i) => i.name)}
    //   tooltipCallBack={customTooltipCallback}
    // />
    <div></div>
  );
});

export default SetupBarChart;
