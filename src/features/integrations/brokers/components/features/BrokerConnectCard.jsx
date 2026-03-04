import { Button, ConnectionBadge } from "@shared/components/ui";
import { useIntegrationStore } from "@shared/stores/useIntegrationStore";

export function BrokerConnectCard({ broker }) {
  const connectBroker = useIntegrationStore((s) => s.connectBroker);
  const disconnectBroker = useIntegrationStore((s) => s.disconnectBroker);

  const loading = useIntegrationStore((s) => s.brokers?.[broker.key]?.loading);
  const connected = useIntegrationStore(
    (s) => s.brokers?.[broker.key]?.connected,
  );

  const handleConnect = () => {
    connectBroker(broker.key);
  };

  const handleDisconnect = () => {
    disconnectBroker(broker.key);
  };

  const isAvailable = broker.available;

  console.log(broker, loading, connected);

  return (
    <div
      className={`flex flex-col min-h-[180px] p-4 rounded-xl border border-(--border) 
      bg-(--surface-disabled) select-none
      hover:shadow-(--shadow-hover) transition-all duration-300
      ${isAvailable ? "opacity-100" : "opacity-60 pointer-events-none"}`}
    >
      {/* TOP */}
      <div className="flex items-center gap-3">
        <img
          src={broker.logo}
          alt={broker.name}
          className={`w-9 h-9 rounded-md object-contain bg-white p-1 
          border ${isAvailable ? "border-(--cyan)" : "border-(--border)"}`}
        />

        <div className="flex flex-col">
          <p className="font-medium text-(--text) text-sm">{broker.name}</p>

          <p
            className={`text-xs font-medium ${
              isAvailable ? "text-(--info)" : "text-(--text-muted)"
            }`}
          >
            {isAvailable ? "Ready to Connect" : "Coming Soon"}
          </p>
        </div>
      </div>

      {/* MIDDLE */}
      <div className="mt-3 text-xs text-(--text-muted)">
        {isAvailable ? (
          <p>
            Connect your {broker.name} account to automatically import trades,
            analyze performance, and track your edge 📊
          </p>
        ) : (
          <p>Integration support coming soon.</p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-4">
        {isAvailable ? (
          connected ? (
            <div className="flex justify-between items-center gap-2">
              <ConnectionBadge text="Connected" size="sm" />
              <Button
                text={"Disconnected"}
                variant="error"
                disabled={loading || !connected}
                onClick={handleDisconnect}
                className="w-full text-sm"
              />
            </div>
          ) : (
            <Button
              text={loading ? "Redirecting..." : `Connect ${broker.name}`}
              variant="info"
              disabled={loading || connected}
              onClick={handleConnect}
              className="w-full text-sm"
            />
          )
        ) : (
          <div className="inline-block px-2.5 py-1 text-[11px] font-medium rounded-full bg-(--hover) text-(--text-muted) mt-6">
            In Development
          </div>
        )}
      </div>

      {/* BOTTOM */}
      <div className="mt-auto pt-3 text-[11px] text-(--text-muted)">
        {isAvailable
          ? "Secure OAuth connection. No manual uploads needed."
          : ""}
      </div>
    </div>
  );
}
