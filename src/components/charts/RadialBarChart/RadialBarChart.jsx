import React, { useRef, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { getRadialBarConfig } from "./radialBarChartCofig";
import { useChartStore } from "@stores";

export default function RadialChart({ chartId }) {
  const chartRef = useRef(null);

  const layout = useChartStore((s) => s.charts[chartId].layout);

  const { options, series } = useMemo(() => {
    const config = getRadialBarConfig({
      chart: useChartStore.getState().charts[chartId],
      chartId,
      chartRef,
    });
    return {
      options: config,
      series: config.series,
    };
  }, [chartId, layout]);

  return (
    <div className="apex-chart-wrapper">
      <ReactApexChart
        // ref={chartRef}
        options={options}
        series={series}
        type="radialBar"
        height={layout.dimensionY}
      />
    </div>
  );
}
