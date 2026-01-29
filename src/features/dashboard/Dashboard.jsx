import { useCallback, useEffect, useRef, useState } from "react";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { ChartPopups, CustomApexChart } from "@charts/index";

import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/gridstack.min.css";
import { Button } from "@ui";
import StatCards from "./components/StatsGrid";
import { Container, Loader } from "@layout";
import { useDashboardStore } from "./store";
import { AddWidget } from "./ui/Popups";

const getColumnCount = () => {
  const w = window.innerWidth;
  if (w < 480) return 6;
  if (w < 768) return 12;
  if (w < 1024) return 20;
  return 30;
};

export const useAsyncTask = (fn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn(...args);
        return result;
      } catch (err) {
        setError(err);
        throw err; // important: lets caller handle it too
      } finally {
        setLoading(false);
      }
    },
    [fn],
  );

  return { run, loading, error };
};

export default function Dashboard() {
  return (
    <>
      <ChartPopups />
      <AddWidget />

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
            <Button
              text="Add Charts and Stats"
              onClick={() => {
                useDashboardStore.getState().openPopup("widget");
              }}
            />
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
  const gridRef = useRef(null);
  const grid = useRef(null);
  const isResponsiveChange = useRef(false);

  const order = useDashboardStore((s) => s.order);

  const savedLayout = useChartStore((s) => s.chartGridLayout);

  const seriesOrder = useDashboardStore((s) => s.seriesOrder);
  const seriesById = useDashboardStore((s) => s.seriesById);

  useEffect(() => {
    if (grid.current) return;

    grid.current = GridStack.init(
      {
        column: getColumnCount(),
        float: false,
        resizable: { handles: "" },
        draggable: { handle: ".chart-toolbar" },
      },
      gridRef.current,
    );

    grid.current.on("resizestop", (_, el) => {
      const chartId = el.getAttribute("gs-id");
      if (chartId) {
        window.dispatchEvent(
          new CustomEvent("chart-resize", { detail: { chartId } }),
        );
      }
    });

    grid.current.on("change", () => {
      if (isResponsiveChange.current) return;

      const safeLayout = grid.current
        .save()
        .map(({ id, x, y, w, h }) => ({ id, x, y, w, h }));

      useChartStore.getState().updateChart((s) => {
        s.chartGridLayout = safeLayout;
      });
    });

    const updateColumns = () => {
      if (!grid.current) return;

      isResponsiveChange.current = true;
      grid.current.column(getColumnCount(), "move");

      requestAnimationFrame(() => {
        isResponsiveChange.current = false;
      });
    };

    updateColumns();
    document.addEventListener("resize", updateColumns);

    return () => {
      grid.current?.destroy(false);
      grid.current = null;
      document.removeEventListener("resize", updateColumns);
    };
  }, []);

  useEffect(() => {
    if (!grid.current) return;

    requestAnimationFrame(() => {
      order.forEach(({ id }) => {
        const el = gridRef.current.querySelector(`[gs-id="${id}"]`);
        if (el && !el.gridstackNode) {
          grid.current.makeWidget(el);
        }
      });
    });
  }, [order]);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    useDashboardStore.getState().hydrateFromTrades();
  }, []);

  return (
    <div className="grid-stack" ref={gridRef}>
      {order.map(({ id, type, category }) => {
        const layout = savedLayout?.find((l) => l.id === id);

        return (
          <div
            key={id}
            className="grid-stack-item"
            gs-id={id}
            gs-x={layout?.x}
            gs-y={layout?.y}
            gs-w={layout?.w ?? (category === "group" ? 10 : 16)}
            gs-h={layout?.h ?? 10}
            gs-min-w={category === "group" ? 8 : 12}
            gs-min-h={8}
            gs-max-h={100}
          >
            <div className="grid-stack-item-content rounded-[8px] shadow-xl">
              <div className="h-full relative">
                <CustomApexChart
                  chartId={id}
                  type={type}
                  category={category}
                  seriesOrder={seriesOrder}
                  seriesById={seriesById}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
