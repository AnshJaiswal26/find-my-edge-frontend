import { Section } from "@shared/components/layout";

export function BrokerIntegration({ brokers }) {
  return (
    <div className="w-full flex justify-center">
      <Section title="Broker Integrations" className="w-full max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {brokers.map((broker) => {
            const isDhan = broker.name.toLowerCase() === "dhan";

            return (
              <div
                key={broker.name}
                className={`flex flex-col min-h-[140px] p-4 rounded-xl border border-(--border) bg-(--surface-light)
                hover:shadow-(--shadow-hover) transition-all duration-300
                ${isDhan ? "" : "opacity-60 pointer-events-none"}`}
              >
                {/* TOP */}
                <div className="flex items-center gap-3">
                  <img
                    src={broker.logo}
                    alt={broker.name}
                    className="w-9 h-9 rounded-md object-contain bg-white p-1 border"
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
                      {isDhan ? "Integration in Progress" : "Coming Soon"}
                    </p>
                  </div>
                </div>

                {/* MIDDLE */}
                <div className="mt-3">
                  {isDhan ? (
                    <div className="inline-block px-2.5 py-1 text-[11px] font-medium rounded-full bg-(--info-soft) text-(--info)">
                      In Development
                    </div>
                  ) : (
                    <div className="inline-block px-2.5 py-1 text-[11px] font-medium rounded-full bg-(--surface-muted) text-(--text-muted)">
                      Coming Soon
                    </div>
                  )}
                </div>

                {/* FUTURE SPACE (IMPORTANT) */}
                {isDhan && (
                  <div className="mt-3 flex-1 rounded-lg border border-dashed border-(--border) bg-(--surface-muted) flex items-center justify-center text-xs text-(--text-muted)">
                    API Integration UI (Coming Next)
                  </div>
                )}

                {/* BOTTOM */}
                <div className="mt-auto pt-3 text-[11px] text-(--text-muted)">
                  {isDhan
                    ? "Backend integration with Dhan will be available soon."
                    : "Support coming soon."}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
