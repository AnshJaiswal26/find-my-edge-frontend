import { useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import Toolbar from "./Toolbar";
import { useChartStore } from "@stores";
import { Container, Legend } from "@layout";
import useChartCfgGenerator from "./hooks/useChartCfgGenerator";
import ApexCharts from "apexcharts";
import styles from "./CustomApexChart.module.css";

export default function CustomApexChart({ chartId, type }) {
  const chartRef = useRef();

  return (
    <Container
      id={`${chartId}-container`}
      className={styles.chartContainer}
      childClassName={styles.chartInnerContainer}
    >
      <div className={`chart-toolbar ${styles.chartDragIcon}`}>⠿</div>

      <TitleAndToolBar chartId={chartId} chartRef={chartRef} type={type} />
      <ChartWithConfig type={type} chartId={chartId} chartRef={chartRef} />
    </Container>
  );
}

function TitleAndToolBar({ chartId, chartRef, type }) {
  const title = useChartStore((s) => s.charts[chartId].layout.title);

  return (
    <div className={styles.chartToolbarWrapper}>
      <div>
        <span>{title}</span>
      </div>

      <Toolbar type={type} chartRef={chartRef} chartId={chartId} />
    </div>
  );
}

function ChartWithConfig({ chartId, chartRef, type }) {
  const { options, layout, seriesConfig, computedSeries } =
    useChartCfgGenerator({ chartId, chartRef, type });
  const { chartWidth } = layout;

  useEffect(() => {
    const listener = (e) => {
      if (e.detail?.chartId === chartId) {
        ApexCharts.exec(chartId, "resize");
      }
    };
    window.addEventListener("chart-resize", listener);
    return () => window.removeEventListener("chart-resize", listener);
  }, []);

  return (
    <div
      id="apexcharts-custom-wrapper"
      style={{
        overflowX:
          chartWidth === 100 || typeof chartWidth === "string"
            ? "hidden"
            : "auto",
      }}
      className={styles.chartWrapper}
    >
      {type !== "radialBar" && (
        <div className={styles.chartLegendWrapper}>
          {seriesConfig.map((s, i) => (
            <Legend
              key={i}
              color={type === "bar" ? s.colors.map((r) => r.color) : s.color}
              label={s.name ?? s.label}
              selected={layout.selectedLegendIndex === i}
              onClick={() =>
                useChartStore.getState().updateChart(chartId, (chart) => {
                  if (chart.seriesConfig.length === 0) return;
                  const idx = chart.layout.selectedLegendIndex;
                  chart.layout.selectedLegendIndex =
                    idx === i && idx != null ? null : i;
                })
              }
            />
          ))}
        </div>
      )}
      <div className="h-full" style={{ width: `${chartWidth}%` }}>
        <ReactApexChart
          key={`${layout?.area}`}
          options={options}
          series={computedSeries}
          type={layout?.area && type === "line" ? "area" : type}
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}
