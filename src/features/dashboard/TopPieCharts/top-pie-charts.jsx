import React, { useMemo, useEffect } from "react";
import Chart from "react-apexcharts";
import { RadialBarChart } from "@charts";
import TradePieChart from "./TradePieChart";
import SetupBarChart from "./SetupBarChart";
import { StatCard } from "@ui";
import { DashboardStatsGrid } from "../layout";
import { Bar, Container, Legend } from "@layout";
import { getMiniBarChartConfig } from "@utils";

function TopPieCharts({ data, theme, isDarkTheme, isSidebarOpen }) {
  const pieChartTradeData = [
    {
      name: "Wins",
      value: 180,
      percentage: "45%",
      color: "#05ab72",
    },
    {
      name: "Losses",
      value: 180,
      percentage: "45%",
      color: "#fe5a5a",
    },
    {
      name: "Breakeven",
      value: 40,
      percentage: "10%",
      color: "#f8c75f",
    },
  ];

  const instrumentData = [
    { name: "Bank Nifty", percentage: "65%" },
    { name: "Nifty 50", percentage: "55%" },
    { name: "Sensex", percentage: "40%" },
  ];

  const pieChartSetupData = [
    {
      name: "Setup 1",
      value: 140,
      percentage: "35%",
      wins: 98,
      Accuracy: "70%",
      color: "#1e74ca",
    }, // blue
    {
      name: "Setup 2",
      value: 140,
      percentage: "35%",
      wins: 91,
      Accuracy: "65%",
      color: "#6e1eca",
    }, // purple
    {
      name: "Setup 3",
      value: 120,
      percentage: "30%",
      wins: 72,
      Accuracy: "60%",
      color: "#f68f2f",
    }, // orange
  ];

  const memoizedPieChartTradeData = useMemo(() => pieChartTradeData, []);
  const memoizedPieChartSetupData = useMemo(() => pieChartSetupData, []);

  const memoizedTotalTrades = useMemo(
    () => memoizedPieChartTradeData.reduce((acc, item) => acc + item.value, 0),
    [memoizedPieChartTradeData]
  );

  const winningStreakData = [1200, 1400, 1000, 900, 1200];
  const rawLosingStreakData = [-500, -470, -600];
  const losingStreakData = rawLosingStreakData.map((v) => Math.abs(v));

  const miniBarOptions = (color) => {
    const isLoss = color !== "#4caf50";
    const customTooltipCallback = (seriesValue) => {
      const val = seriesValue[0];
      const displayVal = isLoss ? `-₹${val}` : `₹${val}`;
      return { dataArray: [{ label: displayVal, color }] };
    };
    return getMiniBarChartConfig({
      type: "stats",
      horizontal: false,
      barColors: [color],
      dataLabels: { enabled: false },
      yaxis: {
        labels: { show: false },
        max: isLoss
          ? Math.max(...losingStreakData)
          : Math.max(...winningStreakData),
        min: 0,
      },
      customTooltipCallback,
    });
  };

  return (
    <div className="top-charts-section">
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        <Container title="Total Trades" className="flex-[1.75]">
          <div className="flex-box">
            <div className="flex-box flex-col flex-4 items-center">
              <TradePieChart
                pieChartTradeData={memoizedPieChartTradeData}
                totalTrades={memoizedTotalTrades}
                theme={theme}
              />

              <div className="flex gap-3">
                {pieChartTradeData.map((entry, index) => (
                  <Legend key={index} color={entry.color} label={entry.name} />
                ))}
              </div>
            </div>

            <div className="flex-box flex-col flex-[6] p-4">
              {pieChartTradeData.map((entry, index) => (
                <Bar
                  key={index}
                  label1={entry.name}
                  label2={`${entry.value} Trades (${entry.percentage})`}
                  color={entry.color}
                  fill={entry.percentage}
                />
              ))}
            </div>
          </div>
        </Container>

        <DashboardStatsGrid className="flex-1">
          {[
            {
              title: "Winning Streak",
              color: "#4caf50",
              value: "5 Trades",
              data: winningStreakData,
            },
            {
              title: "Lossing Streak",
              color: "#f44336",
              value: "3 Trades",
              data: losingStreakData,
            },
          ].map(({ title, color, value, data }, i) => (
            <StatCard
              key={i}
              title={title}
              icon={
                <Chart
                  options={miniBarOptions(color)}
                  series={[{ data }]}
                  type="bar"
                  height={60}
                  width={100}
                />
              }
              value={value}
            />
          ))}
        </DashboardStatsGrid>
      </div>

      <div className="streak-and-setup-pie-chart-section">
        <div className="setup-pie-chart-section">
          <h3>Total Trades on Setups</h3>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <RadialBarChart
              data={memoizedPieChartSetupData}
              totalTrades={memoizedTotalTrades}
              isSidebarOpen={isSidebarOpen}
              isDarkTheme={isDarkTheme}
            />
          </div>
          <div className="setup-pie-chart-legend">
            {pieChartSetupData.map((entry, index) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  flexWrap: "wrap",
                }}
                key={index}
              >
                <div
                  key={index}
                  className="legend-indicator"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span> {entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="setup-bar-chart-section">
          <div>
            <h3>Setups Accuracy</h3>
          </div>

          <SetupBarChart
            data={memoizedPieChartSetupData}
            totalTrades={memoizedTotalTrades}
            isSidebarOpen={isSidebarOpen}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}

export default TopPieCharts;
