import { useEffect, useState } from "react";

import { ChartPopups } from "@modules/charts";

import {
  BrokerConnectCard,
  NoTradesEmptyState,
  Button,
} from "@shared/components/ui";
import { Container } from "@shared/components/layout";

import { useIntegrationsStore, useTradeStore } from "@shared/stores";

import { useDashboardStore } from "./store";
import { AddWidgetPopup } from "./components/modals";
import { ChartGridStack } from "./components/charts";
import { StatsGridStack } from "./components/stats";
import { DashboardSkeleton } from "./components/ui";

import { dashboardInit } from "./init";

import {
  BROKERS,
  CONNECTION_STATUS,
} from "@features/integrations/brokers/config";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const isEmpty = useTradeStore((s) => s.tradesOrder.length === 0);
  const isNotConnected = useIntegrationsStore(
    (s) =>
      s.brokers[BROKERS.DHAN.key]?.status === CONNECTION_STATUS.NOT_CONNECTED,
  );

  useEffect(() => {
    if (isNotConnected && isEmpty) return;

    const init = async () => {
      await dashboardInit();
      setLoading(false);
    };
    init();
  }, []);

  if (isNotConnected && isEmpty)
    return <BrokerConnectCard broker={BROKERS.DHAN} />;

  if (loading) return <DashboardSkeleton />;
  if (isEmpty) return <NoTradesEmptyState />;

  return <DashboardContent />;
}

function DashboardContent() {
  return (
    <>
      <ChartPopups />
      <AddWidgetPopup />

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

      <ChartGridStack />
    </>
  );
}
