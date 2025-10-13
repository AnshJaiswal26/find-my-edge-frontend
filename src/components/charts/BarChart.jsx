import { useCallback, useEffect, useMemo, useRef } from "react";
import Chart from "react-apexcharts";
import { getBarChartConfig } from "@utils";
import { ChartToolbar } from "@ui";
import { useChartStore } from "@stores";
import { Container } from "@layout";

export default function BarChart({ chartId }) {
  const chartRef = useRef();
  const chartWrapperRef = useRef();
  const dimensions = useChartStore((s) => s.charts[chartId].layout.dimensions);

  return (
    <div id={chartId} style={{ width: `${dimensions}%` }}>
      <Container childClassName="flex-wrap flex-col gap-0">
        <TitleAndToolBar
          chartId={chartId}
          chartRef={chartRef}
          chartWrapperRef={chartWrapperRef}
        />
        <div ref={chartWrapperRef} id="apexcharts-custom-wrapper">
          <BarChartWithConfig
            chartId={chartId}
            chartRef={chartRef}
            dimensions={dimensions}
          />
        </div>
      </Container>
    </div>
  );
}

function TitleAndToolBar({ chartId, chartRef, chartWrapperRef }) {
  const title = useChartStore((s) => s.charts[chartId].layout.title);

  return (
    <div
      className={`flex items-center justify-${
        title ? "between" : "end"
      } select-none pr-1 h-[fit-content]`}
    >
      {title && (
        <div className="text-[1.5rem]">
          <span>{title}</span>
        </div>
      )}
      <ChartToolbar
        chartRef={chartRef}
        chartId={chartId}
        chartWrapperRef={chartWrapperRef}
      />
    </div>
  );
}

function BarChartWithConfig({ chartId, chartRef, dimensions }) {
  const layoutCfg = useChartStore((s) => s.charts[chartId].layout);
  const filteredSeries = useChartStore((s) => s.charts[chartId].filteredSeries);
  const seriesConfig = useChartStore((s) => s.charts[chartId].seriesConfig);

  const wrapperWidth = layoutCfg.wrapperWidth;
  const chartWidth = layoutCfg.chartWidth;

  const tooltipCallBack = useCallback(
    (seriesValue, index, w) => {
      const { filteredSeries, labelsKey, seriesConfig } =
        useChartStore.getState().charts[chartId];

      return {
        title: filteredSeries[index][labelsKey],
        dataArray: seriesValue.map((value, i) => {
          const { color, label } = seriesConfig[i].colors.reduce((a, r) => {
            if (r.from <= value && value <= r.to) {
              a.color = r.color;
              a.label = r.label;
            }
            return a;
          }, {});

          return { value, label, color };
        }),
      };
    },
    [chartId]
  );

  const options = useMemo(
    () =>
      getBarChartConfig({
        config: layoutCfg,
        chartRef,
        chartId,
        tooltipCallBack,
        series: filteredSeries,
      }),
    [layoutCfg, tooltipCallBack, filteredSeries]
  );

  return (
    <div
      style={{ maxWidth: `${wrapperWidth}px` }}
      className="relative overflow-x-auto overflow-y-hidden box-border w-[100%]"
    >
      <Chart
        key={chartWidth + dimensions}
        options={options}
        series={seriesConfig.map((cfg) => ({
          name: cfg.key,
          type: cfg.type,
          data: filteredSeries.map((d) => d[cfg.key]),
          color: ({ value }) =>
            cfg.colors.reduce((a, r) => {
              r.from <= value && value <= r.to && (a = r.color);
              return a;
            }, "var(--color-red)"),
        }))}
        type="bar"
        height={"400px"}
        width={`${chartWidth}%`}
      />
    </div>
  );
}
