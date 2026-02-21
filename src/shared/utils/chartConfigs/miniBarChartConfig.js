import { customTooltip } from "../../../modules/charts/apex/tooltip/customTooltip";

export const getMiniBarChartConfig = ({ customTooltipCallback, barColors }) => {
  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    grid: { show: false },
    plotOptions: {
      bar: { vertical: true, columnWidth: "75%", borderRadius: 2 },
    },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
    tooltip: { enabled: true, custom: customTooltip(customTooltipCallback) },
    colors: barColors,
    dataLabels: { show: false },
    legend: { show: false },
  };

  return options;
};
