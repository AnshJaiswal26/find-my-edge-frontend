import { useCallback, useMemo, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import { ChartToolbar } from "@ui";
import { useChartStore } from "@stores";
import { Container, Legend } from "@layout";
import { getBarChartConfig } from "../BarChart/barChartConfig";
import { getLineChartConfig } from "../LineChart/lineChartConfig";

export default function CartesianChart({ chartId, type }) {
  const chartRef = useRef();
  const chartWrapperRef = useRef();

  const layout = useChartStore((s) => s.charts[chartId].layout);

  const { dimensionX, dimensionY } = layout;

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
          type={type}
          dimensions={{ dimensionX, dimensionY }}
        />
        <div ref={chartWrapperRef} id="apexcharts-custom-wrapper">
          <ChartWithConfig
            type={type}
            chartId={chartId}
            chartRef={chartRef}
            dimensions={{ dimensionX, dimensionY }}
          />
        </div>
      </Container>
    </div>
  );
}

function TitleAndToolBar({
  chartId,
  chartRef,
  dimensions,
  chartWrapperRef,
  type,
}) {
  const title = useChartStore((s) => s.charts[chartId].layout.title);

  return (
    <div
      className={`flex items-center flex-wrap justify-${
        title ? "between" : "end"
      } select-none pr-1 h-[fit-content]`}
    >
      {title && (
        <div style={{ fontSize: `${12 + dimensions.dimensionX / 10}px` }}>
          <span>{title}</span>
        </div>
      )}
      <ChartToolbar
        type={type}
        chartRef={chartRef}
        chartId={chartId}
        chartWrapperRef={chartWrapperRef}
      />
    </div>
  );
}

function ChartWithConfig({ chartId, chartRef, dimensions, type }) {
  const layout = useChartStore((s) => s.charts[chartId].layout);
  const filteredSeries = useChartStore((s) => s.charts[chartId].filteredSeries);
  const series = useChartStore((s) => s.charts[chartId].series);
  const seriesConfig = useChartStore((s) => s.charts[chartId].seriesConfig);

  const { wrapperWidth, chartWidth } = layout;

  // --- Tooltip callback ---
  const tooltipCallBack = useCallback(
    (seriesValue, index, w) => {
      const { filteredSeries, xLabelsKey, seriesConfig } =
        useChartStore.getState().charts[chartId];

      if (type === "bar") {
        return {
          title: filteredSeries?.[index]?.[xLabelsKey],
          dataArray: seriesValue?.map((value, i) => {
            const { color, label } = seriesConfig[i].colors.reduce((a, r) => {
              if (r.from <= value && value <= r.to) {
                a.color = r.color;
                a.label = r.label;
              }
              return a;
            }, {});
            return {
              value: layout.yLabelPrefix + value + layout.yLabelSuffix,
              label,
              color,
            };
          }),
        };
      }

      // line / area tooltip
      return {
        title: filteredSeries[index][xLabelsKey],
        dataArray: seriesValue.map((value, i) => ({
          value: layout.yLabelPrefix + value + layout.yLabelSuffix,
          label: seriesConfig[i].name,
          color: seriesConfig[i].color,
        })),
      };
    },
    [chartId, type]
  );

  // --- Config Selection ---
  const configGenerator =
    type === "bar" ? getBarChartConfig : getLineChartConfig;

  const options = useMemo(
    () =>
      configGenerator({
        chart: useChartStore.getState().charts[chartId],
        chartRef,
        chartId,
        tooltipCallBack,
      }),
    [layout, seriesConfig, filteredSeries, chartRef]
  );

  // --- Series ---
  const computedSeries =
    type === "bar"
      ? seriesConfig.map((s) => ({
          name: s.name,
          data: filteredSeries.map((d) => d?.[s.key]),
          color: ({ value }) =>
            s.colors.reduce((a, r) => {
              r.from <= value && value <= r.to && (a = r.color);
              return a;
            }, "var(--color-default)"),
        }))
      : seriesConfig.map((s) => {
          return {
            name: s.name,
            data: filteredSeries.map((d) => d?.[s.key]),
            color: s.color,
          };
        });

  return (
    <div
      style={{ maxWidth: `${wrapperWidth}px` }}
      className="relative overflow-x-auto overflow-y-hidden box-border w-[100%]"
    >
      {/* {seriesConfig.map((s, i) => (
        <Legend
          key={i}
          color={type === "line" ? s.color : s.colors.map((r) => r.color)}
          label={s}
        />
      ))} */}
      <ReactApexChart
        key={
          chartWidth +
          dimensions.dimensionX +
          dimensions.dimensionY +
          layout?.area
        }
        options={options}
        series={computedSeries}
        type={layout?.area && type === "line" ? "area" : type}
        height={`${dimensions.dimensionY}px`}
        width={`${chartWidth}%`}
      />
    </div>
  );
}
