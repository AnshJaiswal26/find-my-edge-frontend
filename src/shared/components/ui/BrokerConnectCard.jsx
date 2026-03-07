import { Brokers } from "@features/integrations/brokers/config";
import { PAGE_CONFIG } from "@pages/config/pageConfig";
import { BrokerLogo } from "@shared/components/ui";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DhanConnectCard({ broker }) {
  const navigate = useNavigate();

  if (!broker) return null;

  const isCompact =
    broker.name === Brokers.ANGEL_BROKING.name ||
    broker.name === Brokers.ZERODHA.name;

  return (
    <div className="w-full h-[82vh] flex items-center justify-center bg-(--surface)">
      <div className="text-center max-w-md py-18 px-10 rounded-2xl border border-(--border) bg-(--surface)">
        {/* Logo */}
        <BrokerLogo imgSrc={broker.logo} zoom={isCompact ? "md" : "lg"} />

        {/* Title */}
        <h2 className="text-xl font-semibold text-(--text) mb-3">
          Connect your {broker.name} account
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-(--text-muted) mb-6">
          Securely link your trading account to start analyzing your trades,
          track performance, and unlock insights.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate(PAGE_CONFIG.INTEGRATIONS.route)}
          className="flex items-center gap-1 justify-center text-sm text-(--text) underline underline-offset-4 hover:text-(--info) transition w-full"
        >
          Connect to {broker.name} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
