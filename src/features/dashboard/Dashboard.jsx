import React from "react";
import { useUIStore } from "@stores";
import StatCards from "./components/StatsGrid";
import TopPieCharts from "./TopPieCharts/top-pie-charts";
import OverAllLineChart from "./Charts/overall-line-chart";
import LastWeekPerformanceLineGraph from "./Charts/last-week-performance-line-chart";
import CapitalGrowthLineChart from "./Charts/capital-growth-line-chart";
import RRPerformanceBarChart from "./Charts/rr-performance-bar-chart";
import WonLoseRateBarChart from "./Charts/win-lose-rate-line-chart";
import CumulativeProfitLineChart from "./Charts/cumulative-profit-line-chart";
import { Container, PageContainer } from "@layout";

import "./Dashboard.css";
import "./Dark-Dashboard.css";
import { Button } from "@ui";

function Dashboard() {
  const theme = useUIStore((s) => s.theme);
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  const isDarkTheme = theme === "dark" ? true : false;

  return (
    <PageContainer pageActive={"dashboard"}>
      <header>
        <Container className="rounded-[4px]">
          <div className="flex-box items-center">
            <img
              className="w-13 h-13"
              src="Icons/others/analysis.png"
              alt="Trading Analysis"
            />
            <div className="flex-box flex-col gap-3">
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
      </header>

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

      <div className="grid gap-5">
        <CapitalGrowthLineChart
          data={"demo"}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
        />

        <RRPerformanceBarChart
          data={"demo"}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
        />

        <WonLoseRateBarChart
          data={"demo"}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
        />

        <CumulativeProfitLineChart
          data={"demo"}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </PageContainer>
  );
}

export default Dashboard;
