import React, { useRef, useMemo } from "react";
import { useChartStore, useUIStore } from "@stores";
import StatCards from "./components/StatsGrid";
import TopPieCharts from "./TopPieCharts/top-pie-charts";
import OverAllLineChart from "./Charts/overall-line-chart";
import { Container } from "@layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./Dashboard.css";
import "./Dark-Dashboard.css";
import { Button, ChartLayoutPopup } from "@ui";
import { CustomApexChart } from "@charts";
import { WidthProvider, Responsive } from "react-grid-layout";

const ReactGridLayout = WidthProvider(Responsive);

function Dashboard() {
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

      <div style={{ width: "100%", marginBottom: "20px" }}>
        <OverAllLineChart
          data={"demo"}
          theme={"dark"}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      <ChartDashboard />
    </>
  );
}

function ChartDashboard() {
  const containerRef = useRef(null);

  const order = useChartStore((s) => s.order);

  const gridLayout = useChartStore.getState().charts.gridLayout;

  const layout = useMemo(() => {
    if (gridLayout) return gridLayout;
    return order.map(({ id }, index) => ({
      i: id,
      x: (index * 4) % 12,
      y: Math.floor(index / 3),
      w: 4,
      h: 20,
      minW: 3,
      minH: 20,
    }));
  }, [gridLayout, order]);

  const layouts = useMemo(
    () => ({
      lg: layout,
      md: layout,
      sm: layout,
      xs: layout,
      xxs: layout,
    }),
    [layout]
  );

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 8, md: 8, sm: 6, xs: 4, xxs: 2 };

  return (
    <div className="w-full h-full  bg-[inherit]" ref={containerRef}>
      <ReactGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        onLayoutChange={(l) =>
          useChartStore.getState().updateChart((s) => (s.charts.gridLayout = l))
        }
        cols={cols}
        rowHeight={10}
        isResizable
        isDraggable
        draggableHandle=".chart-toolbar"
        onResizeStop={(layout, oldItem, newItem) => {
          window.dispatchEvent(
            new CustomEvent("chart-resize", { detail: { chartId: newItem.i } })
          );
        }}
      >
        {order.map(({ id, type }) => (
          <div
            key={id}
            className="bg-[inherit] border-dashed border-1 border-[var(--resize-border)] rounded-xl min-h-[fit-content] grid-chart-wrapper"
          >
            <div className="p-1 box-border h-full relative">
              <CustomApexChart chartId={id} type={type} />
            </div>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
}

export default Dashboard;
