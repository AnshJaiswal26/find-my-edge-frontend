import { Button, ConnectionBadge, ValueBadge } from "@shared/components/ui";
import { useIntegrationsStore } from "@shared/stores";
import { ConnectionStatus } from "@features/integrations/brokers/config";

const badgeMap = {
  [ConnectionStatus.CONNECTED]: {
    text: "Active",
    color: "text-(--success) bg-(--success-soft)",
  },
  [ConnectionStatus.TOKEN_EXPIRED]: {
    text: "Connection Expired",
    color: "text-(--error) bg-(--error-soft)",
  },
  [ConnectionStatus.DISCONNECTED]: {
    text: "Disconnected",
    color: "text-(--error) bg-(--error-soft)",
  },
  [ConnectionStatus.NOT_CONNECTED]: {
    text: "Not Active",
    color: "text-(--error) font-bold bg-(--error-soft)",
  },
};

export function BrokerConnectCard({ broker }) {
  const connectBroker = useIntegrationsStore((s) => s.connectBroker);
  const disconnectBroker = useIntegrationsStore((s) => s.disconnectBroker);

  const loading = useIntegrationsStore((s) => s.brokers?.[broker.key]?.loading);
  const brokerState = useIntegrationsStore((s) => s.brokers?.[broker.key]);

  const status = brokerState?.status ?? ConnectionStatus.NOT_CONNECTED;
  const connectedAt = brokerState?.connectedAt;

  const handleConnect = () => {
    localStorage.setItem("connectStatus", status);
    connectBroker(broker.key);
  };

  const handleDisconnect = () => {
    disconnectBroker(broker.key);
  };

  const isAvailable = broker.available;

  const badge = badgeMap[status] || badgeMap[ConnectionStatus.CONNECTED];

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

      {!isAvailable && (
        <div className="h-full flex items-start mt-3">
          <div
            className={`text-(--info) bg-(--info-soft) font-bold py-0.5 px-2 rounded w-30`}
          >
            In Development
          </div>
        </div>
      )}

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
      {isAvailable && (
        <div className="mt-4 flex justify-between items-center gap-2">
          <div className={`${badge.color} font-bold py-0.5 px-2 rounded`}>
            {badge.text}
          </div>

          {ConnectionStatus.isConnected(status) ? (
            <Button
              text={loading ? "Disconnecting..." : "Disconnect"}
              variant="error"
              disabled={loading}
              onClick={handleDisconnect}
            />
          ) : (
            <Button
              text={
                loading
                  ? "Redirecting..."
                  : ConnectionStatus.isTokenExpired(status)
                    ? "Reconnect"
                    : `Connect ${broker.name}`
              }
              variant="info"
              disabled={loading}
              onClick={handleConnect}
            />
          )}
        </div>
      )}

      {/* BOTTOM */}
      {isAvailable && (
        <div className="mt-auto pt-3 text-[11px] text-(--text-muted)">
          {ConnectionStatus.isConnected(status)
            ? `${ConnectionStatus.isTokenExpired(status) ? "Last " : ""}Connected ${connectedAt ? `• ${connectedAt}` : ""}`
            : "Secure OAuth connection. No manual uploads needed."}
        </div>
      )}
    </div>
  );
}
