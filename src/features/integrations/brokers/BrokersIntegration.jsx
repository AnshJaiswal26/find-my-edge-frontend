import { Section } from "@shared/components/layout";
import { Button } from "@shared/components/ui";

const brokers = [
  { name: "Dhan", logo: "Icons/broker/dhan.png" },
  { name: "Angel One", logo: "Icons/broker/angel one.png" },
  { name: "Groww", logo: "Icons/broker/groww.png" },
  { name: "Upstox", logo: "Icons/broker/upstox.png" },
  { name: "Zerodha Kite", logo: "Icons/broker/zerodha kite.png" },
];

export function BrokerIntegration() {
  const handleConnectDhan = () => {
    // 🔥 later: redirect to your OAuth flow
    console.log("Connect Dhan clicked");
  };

  return (
    <div className="w-full flex justify-center">
      <Section className="w-full p-7">
        <div>
          <h1 className="text-2xl font-bold text-(--text)">
            Broker Integrations
          </h1>
        </div>

        <p className="text-sm text-(--text-muted) mt-1.5 max-w-md">
          Connect your brokers to sync portfolio data automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
          {brokers.map((broker) => {
            const isDhan = broker.name.toLowerCase() === "dhan";

            return (
              <div
                key={broker.name}
                className={`flex flex-col min-h-[180px] p-4 rounded-xl border border-(--border) 
                bg-(--surface-disabled) select-none
                hover:shadow-(--shadow-hover) transition-all duration-300
                ${isDhan ? "opacity-100" : "opacity-60 pointer-events-none"}`}
              >
                {/* TOP */}
                <div className="flex items-center gap-3">
                  <img
                    src={broker.logo}
                    alt={broker.name}
                    className={`w-9 h-9 
                    rounded-md object-contain bg-white p-1 
                    border ${isDhan ? "border-(--cyan)" : "border-(--border)"}`}
                  />

                  <div className="flex flex-col">
                    <p className="font-medium text-(--text) text-sm">
                      {broker.name}
                    </p>

                    <p
                      className={`text-xs font-medium ${
                        isDhan ? "text-(--info)" : "text-(--text-muted)"
                      }`}
                    >
                      {isDhan ? "Ready to Connect" : "Coming Soon"}
                    </p>
                  </div>
                </div>

                {/* MIDDLE CONTENT */}
                <div className="mt-3 text-xs text-(--text-muted)">
                  {isDhan ? (
                    <p>
                      Connect your Dhan account to automatically import trades,
                      analyze performance, and track your edge 📊
                    </p>
                  ) : (
                    <p>Integration support coming soon.</p>
                  )}
                </div>

                {/* CTA / STATUS */}
                <div className="mt-4">
                  {isDhan ? (
                    <Button
                      text={"Connect Dhan"}
                      variant="info"
                      onClick={handleConnectDhan}
                      className="w-full text-sm"
                    />
                  ) : (
                    <div className="inline-block px-2.5 py-1 text-[11px] font-medium rounded-full bg-(--hover) text-(--text-muted) mt-6">
                      In Development
                    </div>
                  )}
                </div>

                {/* BOTTOM */}
                <div className="mt-auto pt-3 text-[11px] text-(--text-muted)">
                  {isDhan
                    ? "Secure OAuth connection. No manual uploads needed."
                    : ""}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
