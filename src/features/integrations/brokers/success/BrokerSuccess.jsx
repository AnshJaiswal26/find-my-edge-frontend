import { ConnectionBadge, BrokerLogo } from "@shared/components/ui";
import { useIntegrationStore } from "@shared/stores/useIntegrationStore";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Brokers } from "../config";

export default function BrokerSuccess() {
  const navigate = useNavigate();
  const { broker } = useParams();

  const fetchBrokerStatus = useIntegrationStore((s) => s.fetchBrokerStatus);
  const brokerState = useIntegrationStore((s) => s.brokers?.[broker]);

  const loading = brokerState?.loading;
  const connected = brokerState?.connected;

  const brokerInfo = Brokers.get(broker);

  const start = useRef(Date.now());

  useEffect(() => {
    if (!broker || !brokerInfo) {
      navigate("/integrations", { replace: true });
      return;
    }

    fetchBrokerStatus(broker);
  }, [broker]);

  useEffect(() => {
    if (loading !== false) return;
    if (connected === null) return;

    const elapsed = Date.now() - start.current;
    const delay = Math.max(800 - elapsed, 0);

    setTimeout(() => {
      if (connected) {
        navigate("/", { replace: true });
      } else {
        navigate("/integrations", { replace: true });
      }
    }, delay);
  }, [loading, connected]);

  return (
    <div className="min-h-[82vh] bg-(--surface) flex items-center justify-center">
      <div className="bg-(--surface-muted) border border-(--border) rounded-2xl p-10 text-center max-w-md w-full space-y-4">
        {/* Logo */}
        <BrokerLogo imgSrc={brokerInfo.logo} />

        <ConnectionBadge
          text={`You have successfully connected to ${brokerInfo.name} 🎉`}
          size="md"
        />

        {/* Subtitle */}
        <p className="text-(--text-muted) text-sm">
          Your account has been successfully linked. We’re preparing your
          dashboard...
        </p>

        {/* Loader */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-3 border-(--hover) border-t-(--text) border-r-(--text) rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
