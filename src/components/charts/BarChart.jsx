import { useMemo, useRef } from "react";
import Chart from "react-apexcharts";
import { getBarChartConfig } from "@utils";
import { ChartToolbar } from "@ui";
import { useChartStore } from "@stores";
import { Container } from "@layout";

export default function BarChart({ chartId }) {
  const chartRef = useRef();
  const chartWrapperRef = useRef();

  const wrapperWidth = useChartStore((s) => s.layouts[chartId].wrapperWidth);

  return (
    <div id={chartId}>
      <Container
        title={"P&L Booked on Risk/Reward"}
        childClassName="flex-wrap flex-col"
      >
        <div className="flex items-center justify-end select-none pr-1 h-[fit-content]">
          <ChartToolbar
            chartRef={chartRef}
            chartId={chartId}
            chartWrapperRef={chartWrapperRef}
          />
        </div>
        <div ref={chartWrapperRef} id="apexcharts-custom-wrapper">
          <div
            style={{ maxWidth: `${wrapperWidth}px` }}
            className="relative overflow-x-auto overflow-y-hidden box-border w-[100%]"
          >
            <BarChartWithConfig chartId={chartId} chartRef={chartRef} />
          </div>
        </div>
      </Container>
    </div>
  );
}

function BarChartWithConfig({ chartId, chartRef }) {
  const updateSeries = useChartStore((s) => s.updateSeries);
  const chartConfig = useChartStore((s) => s.charts[chartId]);
  const filteredSeries = chartConfig.filteredSeries;
  const seriesConfig = chartConfig.seriesConfig;
  const labelsKey = chartConfig.labelsKey;

  const chartWidth = useChartStore((s) => s.layouts[chartId].chartWidth);

  const tooltipCallBack = (seriesValue, index, w) => {
    const category = filteredSeries[index][labelsKey];
    return {
      title: category,
      dataArray: seriesValue.map((v, i) => {
        const cfg = seriesConfig[i];
        return {
          label: cfg.labelConditions(v),
          value: v,
          color: cfg.color({ value: v }),
        };
      }),
    };
  };

  const options = useMemo(
    () =>
      getBarChartConfig({
        config: chartConfig,
        events: {
          selection: (chartCtx, { xaxis }) => {
            const min = Math.max(0, Math.floor(xaxis.min || 0));
            const max = Math.floor(xaxis.max || 0);

            const filteredSeries =
              [...useChartStore.getState().charts[chartId].filteredSeries];

            const sliced = filteredSeries.slice(
              min,
              Math.min(max + 1, filteredSeries.length)
            );
            const updatedSeries = sliced.length < 2 ? filteredSeries : sliced;
            updateSeries(chartId, updatedSeries);
          },

          mounted: (chartCtx) => (chartRef.current = chartCtx.el),
        },
        tooltipCallBack,
      }),
    [chartConfig, tooltipCallBack, updateSeries]
  );

  return (
    <Chart
      key={chartWidth}
      options={options}
      series={seriesConfig.map((cfg) => ({
        name: cfg.key,
        type: cfg.type,
        data: filteredSeries.map((d) => d[cfg.key]),
        color: cfg.color,
      }))}
      type="bar"
      height={"400px"}
      width={`${chartWidth}%`}
    />
  );
}
