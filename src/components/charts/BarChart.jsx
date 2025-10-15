import { useCallback, useMemo, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { getBarChartConfig } from "@utils";
import { ChartToolbar } from "@ui";
import { useChartStore } from "@stores";
import { Container } from "@layout";

export default function BarChart({ chartId }) {
  const chartRef = useRef();
  const chartWrapperRef = useRef();
  const dimensionX = useChartStore((s) => s.charts[chartId].layout.dimensionX);
  const dimensionY = useChartStore((s) => s.charts[chartId].layout.dimensionY);

  return (
    <div id={chartId} style={{ width: `${dimensionX}%` }}>
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

  const adjustFontSize = () => {
    const fontSize = (18 * dimensions.dimensionX) / 75;
    return Math.max(17, fontSize);
  };

  return (
    <div
      className={`flex items-center flex-wrap justify-${
        title ? "between" : "end"
      } select-none pr-1 h-[fit-content]`}
    >
      {title && (
        <div style={{ fontSize: adjustFontSize() }}>
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
    [layoutCfg, tooltipCallBack, filteredSeries, chartId, chartRef]
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
          data: filteredSeries.map((d, i) => ({
            x: i + 1,
            y: d[cfg.key],
          })),
          color: ({ value }) =>
            cfg.colors.reduce((a, r) => {
              r.from <= value && value <= r.to && (a = r.color);
              return a;
            }, "var(--color-red)"),
        }))}
        type="bar"
        height={`${dimensions.dimensionY}px`}
        width={`${chartWidth}%`}
      />
    </div>
  );
}

function SelectionContainer({ chartRef, dimensions }) {
  const selectionRef = useRef();
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    setIsSelecting(true);
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });

    const sel = selectionRef.current;
    sel.style.display = "block";
    sel.style.left = `${x}px`;
    sel.style.top = `${y}px`;
    sel.style.width = "0px";
    sel.style.height = "0px";
  };

  const onMouseMove = (e) => {
    if (!isSelecting) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const sel = selectionRef.current;
    sel.style.left = `${Math.min(x, startPos.x)}px`;
    sel.style.top = `${Math.min(y, startPos.y)}px`;
    sel.style.width = `${Math.abs(x - startPos.x)}px`;
    sel.style.height = `${Math.abs(y - startPos.y)}px`;
  };

  const onMouseUp = (e) => {
    setIsSelecting(false);
    const sel = selectionRef.current;
    sel.style.display = "none";

    // compute selected bars here
    const rect = sel.getBoundingClientRect();
    selectBarsInRect(rect);
  };

  return (
    <div
      className="absolute w-[200px] border-1 border-dashed bg-[#0067b7] opacity-20"
      style={{ height: `${dimensions.dimensionY}px` }}
    ></div>
  );
}
