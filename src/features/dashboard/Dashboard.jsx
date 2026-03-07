import { useEffect, useMemo, useRef, useState } from "react";
import { GridStack } from "gridstack";

import { ChartPopups } from "@modules/charts";

import "gridstack/dist/gridstack.min.css";

import { BrokerConnectCard, Button } from "@shared/components/ui";
import { Container } from "@shared/components/layout";

import { useDashboardStore } from "./store";
import { AddWidgetPopup } from "./components/ui/Popups";
import { ChartGridItem, StatsGrid } from "./components/feature";
import { useIntegrationsStore, useTradeStore } from "@shared/stores";
import DashboardSkeleton from "./components/ui/DashboardSkeleton";
import { dashboardInit } from "./init/dashboard.init";
import NoTradesEmptyState from "@shared/components/ui/NoTradesEmptyState";
import {
  Brokers,
  ConnectionStatus,
} from "@features/integrations/brokers/config";

const getColumnCount = () => {
  const w = document.innerWidth;
  if (w < 480) return 6;
  if (w < 768) return 12;
  if (w < 1024) return 20;
  return 30;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const isEmpty = useTradeStore((s) => s.tradesOrder.length === 0);
  const isNotConnected = useIntegrationsStore(
    (s) =>
      s.brokers[Brokers.DHAN.key]?.status === ConnectionStatus.NOT_CONNECTED,
  );

  useEffect(() => {
    if (isNotConnected && isEmpty) {
      return;
    }

    const init = async () => {
      await dashboardInit();
      setLoading(false);
    };
    init();
  }, []);

  console.log(isNotConnected);

  if (isNotConnected && isEmpty)
    return <BrokerConnectCard broker={Brokers.DHAN} />;

  if (loading) return <DashboardSkeleton />;
  if (isEmpty) return <NoTradesEmptyState />;

  return <DashboardContext />;
}

function DashboardContext() {
  const seriesOrder = useTradeStore((s) => s.tradesOrder);
  const tradesById = useTradeStore((s) => s.tradesById);
  const derivedByTradeId = useTradeStore((s) => s.derivedByTradeId);

  const schemasById = useTradeStore((s) => s.schemasById);
  const schemasOrder = useTradeStore((s) => s.schemasOrder);

  const seriesById = useMemo(() => {
    const result = {};

    seriesOrder.forEach((id) => {
      result[id] = {
        ...tradesById[id],
        ...(derivedByTradeId[id] || {}),
      };
    });

    return result;
  }, [seriesOrder, tradesById, derivedByTradeId]);

  return (
    <>
      <ChartPopups
        seriesById={seriesById}
        seriesOrder={seriesOrder}
        schemasById={schemasById}
        schemasOrder={schemasOrder}
      />
      <AddWidgetPopup
        seriesById={seriesById}
        seriesOrder={seriesOrder}
        schemasById={schemasById}
        schemasOrder={schemasOrder}
      />

      {/* <ConfirmationPopup
        open={true}
        onCancel={() => null}
        onConfirm={() => null}

        
      /> */}

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

      {/* {seriesOrder.length === 0 && <DhanConnectCard />} */}
      {/* <NoTradesEmptyState /> */}

      {/* <NoTradesFound /> */}

      <StatsGrid />

      {/* <TopPieCharts
        data={"demo"}
        theme={"dark"}
        isDarkTheme={isDarkTheme}
        isSidebarOpen={isSidebarOpen}
      /> */}

      <ChartsWrapper
        seriesById={seriesById}
        seriesOrder={seriesOrder}
        schemasById={schemasById}
        schemasOrder={schemasOrder}
      />
    </>
  );
}

function ChartsWrapper({ ...props }) {
  if (!props.seriesById || Object.keys(props.seriesById).length === 0)
    return null;

  return <ChartDashboard {...props} />;
}

function ChartDashboard({
  seriesOrder,
  seriesById,
  schemasById,
  schemasOrder,
}) {
  const gridRef = useRef(null);
  const grid = useRef(null);
  const isResponsiveChange = useRef(false);

  const chartsOrder = useDashboardStore((s) => s.chartsOrder);

  useEffect(() => {
    if (!gridRef.current) return;
    if (!chartsOrder?.length) return;
    if (grid.current) return;

    // 🔥 INIT GRID ONLY ONCE (after items exist)
    const instance = GridStack.init(
      {
        column: getColumnCount(),
        float: false,
        resizable: { handles: "" },
        draggable: { handle: ".chart-toolbar" },
        animate: false, // ✅ prevent jump animations
      },
      gridRef.current,
    );

    grid.current = instance;

    /* ------------------ EVENTS ------------------ */

    const handleResizeStop = (_, el) => {
      const chartId = el.getAttribute("gs-id");
      if (chartId) {
        window.dispatchEvent(
          new CustomEvent("chart-resize", { detail: { chartId } }),
        );
      }
    };

    const handleChange = () => {
      if (isResponsiveChange.current) return;

      const layout = Object.fromEntries(
        instance
          .save()
          .map(({ id, x, y, w, h }) => (id ? [id, { x, y, w, h }] : null))
          .filter(Boolean),
      );

      useDashboardStore.getState().setLayout(layout);
    };

    instance.on("resizestop", handleResizeStop);
    instance.on("change", handleChange);

    /* ------------------ RESPONSIVE ------------------ */

    const updateColumns = () => {
      if (!grid.current) return;

      isResponsiveChange.current = true;
      instance.column(getColumnCount(), "move");

      requestAnimationFrame(() => {
        isResponsiveChange.current = false;
      });
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    /* ------------------ CLEANUP ------------------ */

    return () => {
      window.removeEventListener("resize", updateColumns);

      if (grid.current) {
        grid.current.destroy(false);
        grid.current = null;
      }
    };
  }, [chartsOrder]);

  useEffect(() => {
    if (!grid.current || !chartsOrder?.length) return;

    const instance = grid.current;

    requestAnimationFrame(() => {
      instance.batchUpdate(true); // 🔥 prevent multiple reflows

      chartsOrder.forEach((id) => {
        const el = gridRef.current?.querySelector(`[gs-id="${id}"]`);

        if (el && !el.gridstackNode) {
          instance.makeWidget(el);
        }
      });

      instance.batchUpdate(false); // 🔥 apply once
    });
  }, [chartsOrder]);

  return (
    <div className="grid-stack" ref={gridRef}>
      {chartsOrder.map((id) => (
        <ChartGridItem
          key={id}
          id={id}
          seriesById={seriesById}
          seriesOrder={seriesOrder}
          schemasById={schemasById}
          schemasOrder={schemasOrder}
        />
      ))}
    </div>
  );
}
