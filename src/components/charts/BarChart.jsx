import { useCallback, useEffect, useMemo, useRef } from "react";
import Chart from "react-apexcharts";
import { getBarChartConfig } from "@utils";
import { ChartToolbar } from "@ui";
import { useChartStore } from "@stores";
import { Container } from "@layout";
import ApexCharts from "apexcharts";

export default function BarChart({ chartId }) {
  const chartRef = useRef();
  const chartWrapperRef = useRef();
  const dimensionX = useChartStore((s) => s.charts[chartId].layout.dimensionX);
  const dimensionY = useChartStore((s) => s.charts[chartId].layout.dimensionY);

  useEffect(() => {
    const handleResize = () => {
      ApexCharts.exec(chartId, "resize");
    };

    // Trigger resize on mount + window resize
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [chartId]);

  return (
    <div
      id={chartId}
      style={{
        width: `${dimensionX}%`,
        "--chart-width": `${dimensionX}px`,
        "--icon-dimension": `${10 + (dimensionX / 10) * 0.5}px`,
      }}
    >
      <Container childClassName="flex-wrap flex-col gap-0">
        <TitleAndToolBar
          chartId={chartId}
          chartRef={chartRef}
          chartWrapperRef={chartWrapperRef}
          dimensions={{ dimensionX, dimensionY }}
        />
        <div ref={chartWrapperRef} id="apexcharts-custom-wrapper">
          <BarChartWithConfig
            chartId={chartId}
            chartRef={chartRef}
            dimensions={{ dimensionX, dimensionY }}
          />
        </div>
      </Container>
    </div>
  );
}

function TitleAndToolBar({ chartId, chartRef, dimensions, chartWrapperRef }) {
  const title = useChartStore((s) => s.charts[chartId].layout.title);

  return (
    <div
      className={`flex items-center flex-wrap justify-${
        title ? "between" : "end"
      } select-none pr-1 h-[fit-content]`}
    >
      {title && (
        <div style={{ fontSize: `${14 + dimensions.dimensionX / 10}px` }}>
          <span>{title}</span>
        </div>
      )}
      <ChartToolbar
        type={"bar"}
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

          return {
            value: layoutCfg.yLabelPrefix + value + layoutCfg.yLabelSuffix,
            label,
            color,
          };
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
    [layoutCfg, tooltipCallBack, filteredSeries, chartId, chartRef]
  );

  return (
    <div
      style={{ maxWidth: `${wrapperWidth}px` }}
      className="overflow-x-auto overflow-y-hidden box-border w-[100%]"
    >
      <Chart
        key={chartWidth + dimensions}
        options={options}
        series={seriesConfig.map((cfg) => ({
          name: cfg.key,
          data: filteredSeries.map((d) => d[cfg.key]),
          color: ({ value }) =>
            cfg.colors.reduce((a, r) => {
              r.from <= value && value <= r.to && (a = r.color);
              return a;
            }, "var(--color-default)"),
        }))}
        type="bar"
        height={`${dimensions.dimensionY}px`}
        width={`${chartWidth}%`}
      />
    </div>
  );
}
