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
import { Button } from "@ui";
import { CustomApexChart, ChartLayoutPopup } from "@charts";
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

  const gridLayout = useChartStore.getState().chartGridLayout;

  const layout = useMemo(() => {
    if (gridLayout) return gridLayout;
    return order.map(({ id, type }, index) => ({
      i: id,
      x: (index * 3) % 12,
      y: Math.floor(index / 3),
      w: type === "radialBar" ? 10 : 16,
      h: 20,
      minW: type === "radialBar" ? 8 : 10,
      minH: 20,
      maxH: 30,
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
  const cols = { lg: 30, md: 26, sm: 22, xs: 18, xxs: 14 };

  return (
    <div
      className="w-full h-full border-3 border-[#152335] bg-[inherit] rounded-[7px] overflow-hidden"
      ref={containerRef}
    >
      <div className="bg-[#16283f] px-3 py-2 text-[#fff]">Risk Metrics</div>
      <ReactGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        onLayoutChange={(l) =>
          useChartStore.getState().updateChart((s) => (s.gridLayout = l))
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
