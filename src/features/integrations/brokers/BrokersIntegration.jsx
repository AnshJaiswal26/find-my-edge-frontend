import { Section } from "@shared/components/layout";
import { BrokerConnectCard } from "./components/features/BrokerConnectCard";
import { BROKERS } from "./config";
import { useEffect } from "react";
import { useIntegrationsStore } from "@shared/stores";
import { Skeleton } from "@shared/components/ui";

const brokers = [
  {
    key: BROKERS.DHAN.key,
    name: BROKERS.DHAN.name,
    logo: BROKERS.DHAN.logo,
    available: true,
  },
  {
    key: BROKERS.ANGEL_BROKING.key,
    name: BROKERS.ANGEL_BROKING.name,
    logo: BROKERS.ANGEL_BROKING.logo,
    available: false,
  },
  {
    key: BROKERS.GROWW.key,
    name: BROKERS.GROWW.name,
    logo: BROKERS.GROWW.logo,
    available: false,
  },
  {
    key: BROKERS.UPSTOX.key,
    name: BROKERS.UPSTOX.name,
    logo: BROKERS.UPSTOX.logo,
    available: false,
  },
  {
    key: BROKERS.ZERODHA.key,
    name: BROKERS.ZERODHA.name,
    logo: BROKERS.ZERODHA.logo,
    available: false,
  },
];

export function BrokerIntegration() {
  const fetchStatus = useIntegrationsStore((s) => s.fetchConnectionStatus);
  const initializing = useIntegrationsStore((s) => s.initializing);

  useEffect(() => {
    fetchStatus(BROKERS.DHAN.key);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <Section className="w-full p-7">
        <h1 className="text-2xl font-bold text-(--text)">
          Broker Integrations
        </h1>

        <p className="text-sm text-(--text-muted) mt-1.5 max-w-md">
          Connect your brokers to sync portfolio data automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
          {brokers.map((broker) =>
            initializing ? (
              <Skeleton key={broker.key} width={"100%"} height={"200px"} />
            ) : (
              <BrokerConnectCard key={broker.key} broker={broker} />
            ),
          )}
        </div>
      </Section>
    </div>
  );
}
