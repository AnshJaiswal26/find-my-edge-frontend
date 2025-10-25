import React, { Fragment, useEffect, useState } from "react";
import { useChartStore, useUIStore } from "@stores";
import StatCards from "./components/StatsGrid";
import TopPieCharts from "./TopPieCharts/top-pie-charts";
import OverAllLineChart from "./Charts/overall-line-chart";
import LastWeekPerformanceLineGraph from "./Charts/last-week-performance-line-chart";
import CapitalGrowthLineChart from "./Charts/capital-growth-line-chart";
import WonLoseRateBarChart from "./Charts/win-lose-rate-line-chart";
import CumulativeProfitLineChart from "./Charts/cumulative-profit-line-chart";
import { Container } from "@layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "./Dashboard.css";
import "./Dark-Dashboard.css";
import { Button, ChartLayoutPopup } from "@ui";
import { BarChart, LineChart } from "@charts";
import ReactGridLayout from "react-grid-layout";

function Dashboard() {
  const theme = useUIStore((s) => s.theme);
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  const isDarkTheme = theme === "dark" ? true : false;

  return (
    <>
      <ChartLayoutPopup />
      <Container className="rounded-[4px]">
        <div className="flex-box items-center">
          <img
            className="w-13 h-13"
            src="Icons/others/analysis.png"
            alt="Trading Analysis"
          />
          <div className="flex-box flex-col gap-3 text-[0.95rem]">
            <div>
              <h2>Trading Analytics Dashboard</h2>
              <p>
                Gain insights into your trading performance with detailed
                analytics, profit and loss tracking, and risk-reward analysis.
              </p>
            </div>
            <Button text="Add Charts and Stats" />
          </div>
        </div>
      </Container>

      <StatCards />

      <TopPieCharts
        data={"demo"}
        theme={theme}
        isDarkTheme={isDarkTheme}
        isSidebarOpen={isSidebarOpen}
      />

      <div style={{ width: "100%", marginBottom: "20px" }}>
        <OverAllLineChart
          data={"demo"}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      <LastWeekPerformanceLineGraph
        data={"demo"}
        theme={theme}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(450px,1fr))] place-items-center gap-5 w-[100%]">
        <Charts />

        <CapitalGrowthLineChart
          data={"demo"}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
        />

        {/* <WonLoseRateBarChart
          data={"demo"}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
        /> */}

        <CumulativeProfitLineChart
          data={"demo"}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* <DashboardLayout theme={theme} isSidebarOpen={isSidebarOpen} /> */}
    </>
  );
}

function Charts() {
  const order = useChartStore((s) => s.order);

  return order.map((chart, index) => (
    <Fragment key={index}>
      {chart.type === "bar" ? (
        <BarChart chartId={chart.id} />
      ) : (
        <LineChart chartId={chart.id} />
      )}
    </Fragment>
  ));
}

// function DashboardLayout({ theme, isSidebarOpen }) {
//   const [layout, setLayout] = useState([
//     { i: "bar1", x: 0, y: 0, w: 1, h: 4 },
//     { i: "bar2", x: 1, y: 0, w: 1, h: 4 },
//     { i: "line1", x: 0, y: 4, w: 2, h: 4 },
//     { i: "growth", x: 0, y: 8, w: 1, h: 4 },
//     { i: "wonlose", x: 1, y: 8, w: 1, h: 4 },
//     { i: "cumulative", x: 0, y: 12, w: 2, h: 4 },
//   ]);

//   return (
//     <ReactGridLayout
//       className="layout"
//       layout={layout}
//       cols={2}
//       rowHeight={1}
//       width={1250}
//       isDraggable={true}
//       margin={[20, 20]}
//       isResizable={true}
//       onLayoutChange={(newLayout) => {
//         setLayout(newLayout);
//         console.log("Layout changed:", newLayout);
//         // You can save layout to backend here
//       }}
//     >
//       <div key="bar1">
//         <BarChart key="bar1" chartId="apex-bar-chart-1" />
//       </div>

//       <div key="bar2">
//         <BarChart chartId="apex-bar-chart-2" />
//       </div>

//       <div key="line1">
//         <LineChart chartId="apex-line-chart-1" />
//       </div>

//       <div key="growth">
//         <CapitalGrowthLineChart
//           data="demo"
//           theme={theme}
//           isSidebarOpen={isSidebarOpen}
//         />
//       </div>

//       <div key="wonlose">
//         <WonLoseRateBarChart
//           data="demo"
//           theme={theme}
//           isSidebarOpen={isSidebarOpen}
//         />
//       </div>

//       <div key="cumulative">
//         <CumulativeProfitLineChart
//           data="demo"
//           theme={theme}
//           isSidebarOpen={isSidebarOpen}
//         />
//       </div>
//     </ReactGridLayout>
//   );
// }

export default Dashboard;
