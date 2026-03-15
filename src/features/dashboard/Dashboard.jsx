import { useEffect, useMemo, useState } from "react";

import { ChartPopups } from "@modules/charts";

import { BrokerConnectCard, Button } from "@shared/components/ui";
import { Container } from "@shared/components/layout";

import { useDashboardStore } from "./store";
import { AddWidgetPopup } from "./components/ui/Popups";
import { ChartGridStack, StatsGridStack } from "./components/feature";
import { useIntegrationsStore, useTradeStore } from "@shared/stores";
import DashboardSkeleton from "./components/ui/DashboardSkeleton";
import { dashboardInit } from "./init/dashboard.init";
import NoTradesEmptyState from "@shared/components/ui/NoTradesEmptyState";
import {
  Brokers,
  ConnectionStatus,
} from "@features/integrations/brokers/config";

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

  // console.log(isNotConnected);

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

      <Container className="rounded-[4px] mb-5">
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

      <StatsGridStack />

      <ChartGridStack
        seriesById={seriesById}
        seriesOrder={seriesOrder}
        schemasById={schemasById}
        schemasOrder={schemasOrder}
      />
    </>
  );
}
