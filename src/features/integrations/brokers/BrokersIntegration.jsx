import { Section } from "@shared/components/layout";
import { BrokerConnectCard } from "./components/features/BrokerConnectCard";
import { Brokers } from "./config";
import { useEffect } from "react";
import { useIntegrationsStore } from "@shared/stores";
import { Skeleton } from "@shared/components/ui";

const brokers = [
  {
    key: Brokers.DHAN.key,
    name: Brokers.DHAN.name,
    logo: Brokers.DHAN.logo,
    available: true,
  },
  {
    key: Brokers.ANGEL_BROKING.key,
    name: Brokers.ANGEL_BROKING.name,
    logo: Brokers.ANGEL_BROKING.logo,
    available: false,
  },
  {
    key: Brokers.GROWW.key,
    name: Brokers.GROWW.name,
    logo: Brokers.GROWW.logo,
    available: false,
  },
  {
    key: Brokers.UPSTOX.key,
    name: Brokers.UPSTOX.name,
    logo: Brokers.UPSTOX.logo,
    available: false,
  },
  {
    key: Brokers.ZERODHA.key,
    name: Brokers.ZERODHA.name,
    logo: Brokers.ZERODHA.logo,
    available: false,
  },
];

export function BrokerIntegration() {
  const fetchStatus = useIntegrationsStore((s) => s.fetchConnectionStatus);
  const initializing = useIntegrationsStore((s) => s.initializing);

  useEffect(() => {
    fetchStatus(Brokers.DHAN.key);
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
