import ReactApexChart from "react-apexcharts";
import Toolbar from "./Toolbar";
import { useChartStore } from "@stores";
import { Container, Legend } from "@layout";
import useChartCfgGenerator from "./hooks/useChartCfgGenerator";
import styles from "./CustomApexChart.module.css";

export default function CustomApexChart({ chartId, type }) {
  return (
    <Container
      id={`${chartId}-container`}
      className={styles.chartContainer}
      childClassName={styles.chartInnerContainer}
    >
      <div className={`chart-toolbar ${styles.chartDragIcon}`}>⠿</div>

      <div className={styles.chartTitleWrapper}>
        <Title chartId={chartId} />
      </div>

      <ChartWithConfig type={type} chartId={chartId} />
    </Container>
  );
}

function Title({ chartId }) {
  const title = useChartStore((s) => s[chartId].live.layout.title);
  return <span>{title}</span>;
}

function ChartWithConfig({ chartId, type }) {
  const { options, layout, seriesConfig, computedSeries, selectedLegendIndex } =
    useChartCfgGenerator({
      chartId,
      type,
    });
  const { chartWidth, legend, legendAlignment, legendPosition } = layout;

  const updateChart = useChartStore((s) => s.updateChart);

  const isZoomedIn = chartWidth === 100 || typeof chartWidth === "string";

  return (
    <div className={styles.chartWrapper}>
      <div className={`${styles.legendChartWrapper} ${styles[legendPosition]}`}>
        {legend && (
          <div className={`${styles.legendWrapper} ${styles[legendAlignment]}`}>
            {seriesConfig.map((s, i) => (
              <Legend
                key={i}
                color={type === "bar" ? s.colors.map((r) => r.color) : s.color}
                label={s.name ?? s.label}
                selected={
                  selectedLegendIndex !== i && selectedLegendIndex !== null
                }
                onClick={() => {
                  if (type === "donut") return;
                  updateChart(chartId, (chart) => {
                    if (chart.live.seriesConfig.length === 1) return;
                    const idx = chart.runtime.selectedLegendIndex;
                    chart.runtime.selectedLegendIndex = idx === i ? null : i;
                  });
                }}
              />
            ))}
          </div>
        )}

        <div
          data-chart-type={type}
          style={{
            overflowX: isZoomedIn ? "" : "auto",
            overflowY: !isZoomedIn ? "hidden" : "",
          }}
          className={styles.chartZoomWrapper}
        >
          <div className="h-full" style={{ width: `${chartWidth}%` }}>
            <ReactApexChart
              key={`${layout?.area}`}
              options={options}
              series={computedSeries}
              type={layout?.area && type === "line" ? "area" : type}
              height={"100%"}
              width={"100%"}
            />
          </div>
        </div>
      </div>{" "}
      <Toolbar type={type} chartId={chartId} />
    </div>
  );
}
