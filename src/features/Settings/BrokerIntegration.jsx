import { ErrorText, Section, SuccessText } from "@layout";

export function BrokerIntegeration({
  brokers,
  apiKeys,
  showVerification,
  apiMessage,
  setApiKeys,
  setShowVerification,
}) {
  return (
    <Section title="Broker Integrations">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {brokers.map((broker) => {
          const brokerKey = apiKeys.find((key) => key.broker === broker.name);
          const isConnected = brokerKey?.status === "verified";
          const isVerifying =
            brokerKey && !isConnected && showVerification[broker.name];

          return (
            <div
              key={broker.name}
              className="group relative p-5 rounded-2xl border border-(--border) bg-(--surface-light)
                     hover:shadow-(--shadow-hover) transition-all duration-300"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={broker.logo}
                    alt={broker.name}
                    className="w-10 h-10 rounded-lg object-contain bg-white p-1 border"
                  />
                  <div>
                    <p className="font-semibold text-(--text)">{broker.name}</p>
                    <p
                      className={`text-sm font-medium ${
                        isConnected
                          ? "text-(--success)"
                          : brokerKey
                            ? "text-(--warning)"
                            : "text-(--text-muted)"
                      }`}
                    >
                      {isConnected
                        ? "Connected"
                        : brokerKey
                          ? "Verification Required"
                          : "Not Connected"}
                    </p>
                  </div>
                </div>

                <button
                  className={`px-4 py-1.5 text-sm rounded-lg font-medium transition
                        ${
                          isConnected
                            ? "bg-(--error-soft) text-(--error) hover:opacity-80"
                            : "bg-(--info-soft) text-(--info) hover:opacity-80"
                        }`}
                >
                  {isConnected ? "Disconnect" : "Connect"}
                </button>
              </div>

              {/* MESSAGE */}
              {apiMessage && apiMessage.includes(broker.name) && (
                <div className="mt-4">
                  {apiMessage.includes("failed") ? (
                    <ErrorText text={apiMessage} />
                  ) : (
                    <SuccessText text={apiMessage} />
                  )}
                </div>
              )}

              {/* VERIFICATION PANEL */}
              {isVerifying && (
                <div className="mt-5 p-4 rounded-xl bg-(--surface-muted) border space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-(--text)">
                      Enter API Credentials
                    </p>
                    <button
                      onClick={() => {
                        setShowVerification((prev) => ({
                          ...prev,
                          [broker.name]: false,
                        }));
                        setApiKeys(
                          apiKeys.filter((key) => key.broker !== broker.name),
                        );
                      }}
                      className="text-(--text-muted) hover:text-(--error)"
                    >
                      ✕
                    </button>
                  </div>

                  <Input
                    label="API Key"
                    placeholder={`Paste ${broker.name} API key`}
                    value={brokerKey.apiKey}
                    onCommit={(v) => {
                      const updated = apiKeys.map((key) =>
                        key.broker === broker.name
                          ? { ...key, apiKey: v }
                          : key,
                      );
                      setApiKeys(updated);
                    }}
                    classNames={{ input: "max-w-full!" }}
                  />

                  <button
                    onClick={() =>
                      handleApiVerification(
                        apiKeys.findIndex((key) => key.broker === broker.name),
                        brokerKey.apiKey,
                      )
                    }
                    className={`w-full py-2 rounded-lg font-medium text-sm transition
                  ${
                    brokerKey.status === "error"
                      ? "bg-(--error-soft) text-(--error)"
                      : "bg-(--info) text-white hover:opacity-90"
                  }`}
                  >
                    {brokerKey.status === "error"
                      ? "Re-authenticate"
                      : "Verify Connection"}
                  </button>
                </div>
              )}

              {/* CONNECTED DETAILS */}
              {brokerKey && isConnected && (
                <div className="mt-5 border-t pt-4 text-sm space-y-2 text-(--text-muted)">
                  <p>
                    API Key:{" "}
                    <span className="font-medium text-(--text)">
                      ••••••••{brokerKey.apiKey.slice(-4)}
                    </span>
                  </p>
                  <p>
                    Connected On:{" "}
                    <span className="text-(--text)">
                      {new Date().toLocaleString()}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-(--success)"></span>
                    Active & Syncing
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
