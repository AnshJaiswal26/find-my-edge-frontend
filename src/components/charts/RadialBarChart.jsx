import React, { useMemo, memo, useState } from "react";
import Chart from "react-apexcharts";
import { getRadialBarChartConfig } from "@utils";

export default function RadialBarChart({ data, totalTrades }) {
  const [activeIndex, setActiveIndex] = useState();
  const series = useMemo(
    () => data.map((item) => parseFloat(item.percentage)),
    [data]
  );
  const config = useMemo(
    () =>
      getRadialBarChartConfig(data, totalTrades, activeIndex, setActiveIndex),
    [data, totalTrades]
  );

  return (
    <Chart
      options={config}
      series={series}
      type="radialBar"
      height={300}
      width={300}
    />
  );
}
