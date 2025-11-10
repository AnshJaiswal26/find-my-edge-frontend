import { useRef, useMemo } from "react";
import { useChartStore } from "@stores";
import StatCards from "./components/StatsGrid";
import { Container } from "@layout";
import { Button } from "@ui";
import { CustomApexChart, ChartLayoutPopup } from "@charts";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WidthProvider, Responsive } from "react-grid-layout";

const ReactGridLayout = WidthProvider(Responsive);

function Dashboard() {
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

      <ChartDashboard />
    </>
  );
}

function ChartDashboard() {
  const containerRef = useRef(null);
  const layoutsRef = useRef(null);

  const handleSaveLayout = (layout, allLayouts) => {
    layoutsRef.current = allLayouts;
    useChartStore.getState().updateChart((s) => {
      s.chartGridLayout = allLayouts;
    });
  };

  const order = useChartStore((s) => s.order);

  const savedLayouts = useChartStore.getState().chartGridLayout;

  const layout = useMemo(() => {
    const itemsPerRow = 3;
    return order.map(({ id, category }, index) => ({
      i: id,
      x: (index % itemsPerRow) * 10,
      y: Math.floor(index / itemsPerRow) * 20,
      w: category === "group" ? 10 : 16,
      h: 20,
      minW: category === "group" ? 8 : 12,
      minH: 20,
      maxH: 100,
    }));
  }, [order]);

  const layouts = useMemo(() => {
    return (
      savedLayouts ?? {
        lg: layout,
        md: layout,
        sm: layout,
        xs: layout,
        xxs: layout,
      }
    );
  }, [savedLayouts, layout]);

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 30, md: 18, sm: 16, xs: 13, xxs: 10 };

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
        cols={cols}
        rowHeight={10}
        isResizable
        isDraggable
        draggableHandle=".chart-toolbar"
        onDragStop={(layout, oldItem, newItem) => {
          handleSaveLayout(layout, layoutsRef.current ?? layouts);
        }}
        onResizeStop={(layout, oldItem, newItem) => {
          handleSaveLayout(layout, layoutsRef.current ?? layouts);
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
