import React from "react";
import { BarChart } from "@charts";
import { useChartStore } from "@stores";

function RRPerformanceBarChart({ data, theme, isSidebarOpen }) {
  // const best = Math.max(...rrSeries);
  // const worst = Math.min(...rrSeries);

  return <BarChart chartId={"apex-line-chart-1"} />;
}

{
  /* <div className="flex-box flex-col rounded-[4px] bg-[#191f2a] p-5 flex-1 mt-[-50px]">
        <div className="flex-box">
          <Badge
            value={best}
            label={"Best: "}
            formatter={(v) => (v < 0 ? v : `1 : ${v}`)}
          />
          <Badge value={worst} label={"Worst: "} />
        </div>
      </div> */
}

export default RRPerformanceBarChart;
