import React from "react";
import { useChartStore, useUIStore } from "@stores";
import StatCards from "./components/StatsGrid";
import TopPieCharts from "./TopPieCharts/top-pie-charts";
import OverAllLineChart from "./Charts/overall-line-chart";
import LastWeekPerformanceLineGraph from "./Charts/last-week-performance-line-chart";
import { Container } from "@layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Dashboard.css";
import "./Dark-Dashboard.css";
import { Button, ChartLayoutPopup } from "@ui";
import { BarChart, LineChart, RadialBarChart } from "@charts";

function Dashboard() {
  // const theme = useUIStore((s) => s.theme);
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  const isDarkTheme = true;

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

      {/* <TopPieCharts
        data={"demo"}
        theme={"dark"}
        isDarkTheme={isDarkTheme}
        isSidebarOpen={isSidebarOpen}
      /> */}

      <RadialBarChart chartId={"radial-bar-chart-1"} />

      <div style={{ width: "100%", marginBottom: "20px" }}>
        <OverAllLineChart
          data={"demo"}
          theme={"dark"}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* <LastWeekPerformanceLineGraph
        data={"demo"}
        theme={"dark"}
        isSidebarOpen={isSidebarOpen}
      /> */}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] place-items-center gap-5 w-[100%]">
        <Charts />
      </div>
    </>
  );
}

function Charts() {
  const order = useChartStore((s) => s.order);

  return order.map((chart, index) => (
    <div key={index} className="w-[100%]">
      {chart.type === "bar" ? (
        <BarChart chartId={chart.id} />
      ) : (
        <LineChart chartId={chart.id} />
      )}
    </div>
  ));
}

export default Dashboard;
