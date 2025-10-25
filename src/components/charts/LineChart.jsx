import { useCallback, useMemo, useRef } from "react";
import Chart from "react-apexcharts";
import { getLineChartConfig } from "@utils";
import { ChartToolbar } from "@ui";
import { useChartStore } from "@stores";
import { Container } from "@layout";

export default function LineChart({ chartId }) {
  const chartRef = useRef();
  const chartWrapperRef = useRef();
  const dimensionX = useChartStore(
    (s) => s.charts?.[chartId]?.layout?.dimensionX
  );

  const dimensionY = useChartStore((s) => s.charts[chartId].layout.dimensionY);

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
          <LineChartWithConfig
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

function LineChartWithConfig({ chartId, chartRef, dimensions }) {
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
          const { colors, label } = seriesConfig[i];
          return {
            value: layoutCfg.yLabelPrefix + value + layoutCfg.yLabelSuffix,
            label,
            color: colors,
          };
        }),
      };
    },
    [chartId]
  );

  const options = useMemo(
    () =>
      getLineChartConfig({
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
          data: filteredSeries.map((d) => d?.[cfg.key]),
          color: cfg.colors,
        }))}
        type="line"
        height={`${dimensions.dimensionY}px`}
        width={`${chartWidth}%`}
      />
    </div>
  );
}
