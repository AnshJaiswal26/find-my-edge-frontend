import { customTooltip } from "../../../utils/chartConfigs/customTooltip";
import { useChartStore } from "@stores";

export const getRadialBarConfig = ({ chart, chartId, chartRef }) => {
  const config = chart.layout;
  const filtered = chart.filteredSeries;
  const seriesConfig = chart.seriesConfig;

  return {
    chart: {
      type: "radialBar",
      height: config.dimensionY,
      toolbar: { show: true, tools: { download: true } },
      events: {
        mounted: (ctx) => (chartRef.current = ctx.el),
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: config.startAngle ?? 0,
        endAngle: config.endAngle ?? 360,
        hollow: { size: config.hollowSize ?? "50%" },
        track: {
          background: config.trackBackground ?? "var(--color-gray-100)",
        },
        dataLabels: {
          showOn: "always",
          name: { show: true },
          value: { show: true },
          total: {
            show: true,
            formatter: (a, b, c) => {
              console.log(a, b, c);
            },
          },
        },
      },
    },
    labels: seriesConfig.map((s) => s.name),
    tooltip: {
      enabled: config.tooltip,
      //   custom: customTooltip((seriesValue, index, w) => {
      //     // radial apex supplies seriesValue; adapt to your tooltipCallBack
      //     return tooltipCallBack([seriesValue], 0, w);
      //   }),
    },
    series: filtered.map((d) => d[seriesConfig[0].key]),
  };
};
