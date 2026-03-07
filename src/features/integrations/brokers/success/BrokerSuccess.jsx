import { useNavigate, useParams } from "react-router-dom";
import { BrokerLogo } from "@shared/components/ui";
import { useIntegrationsStore } from "@shared/stores";
import { useEffect, useRef, useState } from "react";
import { Brokers } from "../config";
import { useUIStore } from "@shared/stores";
import { dashboardInit } from "@features/dashboard/init/dashboard.init";
import { tradeSyncService } from "@shared/services/tradesSync.service";
import { Check, ShieldCheck, TrendingUp, LayoutDashboard } from "lucide-react";
import { PAGE_CONFIG } from "@pages/config/pageConfig";

// ─── Step config ────────────────────────────────────────────────────────────
const STEPS = { CONNECTED: 0, SYNCING: 1, PREPARING: 2 };

const STEP_CONFIG = [
  {
    id: STEPS.CONNECTED,
    icon: ShieldCheck,
    label: "Broker Connected",
    messages: [
      "Verifying credentials…",
      "Handshake confirmed",
      "Secure channel established",
    ],
  },
  {
    id: STEPS.SYNCING,
    icon: TrendingUp,
    label: "Importing Trades",
    messages: [
      "Fetching trade history…",
      "Processing open positions…",
      "Reconciling P&L records…",
      "Validating trade data…",
    ],
  },
  {
    id: STEPS.PREPARING,
    icon: LayoutDashboard,
    label: "Preparing Dashboard",
    messages: [
      "Calculating analytics…",
      "Building performance metrics…",
      "Almost ready…",
    ],
  },
];

// ─── Live message cycler ─────────────────────────────────────────────────────
function useLiveMessage(messages, active, intervalMs = 1800) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      setVisible(true);
      return;
    }
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setVisible(true);
      }, 200);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [active, messages, intervalMs]);

  return { message: messages[index], visible };
}

// ─── Individual step row ─────────────────────────────────────────────────────
function StepRow({ config, status }) {
  const active = status === "active";
  const done = status === "done";
  const pending = status === "pending";

  const { message, visible } = useLiveMessage(config.messages, active);
  const Icon = config.icon;

  return (
    <div
      className={`
    relative flex items-center gap-3 rounded-xl px-2 py-1.5
    transition-all duration-500 overflow-hidden
    ${active ? "bg-(--surface) border border-(--border) shadow-sm" : ""}
    ${pending ? "opacity-40" : ""}
  `}
    >
      {/* Icon bubble */}
      <div
        className={`
          relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          transition-all duration-500
          ${done ? "bg-(--success)/15 text-(--success)" : ""}
          ${active ? "bg-(--info)/15 text-(--info)" : ""}
          ${pending ? "bg-(--border)/40 text-(--text-muted)" : ""}
        `}
      >
        {/* Pulse ring on active */}
        {active && (
          <>
            <span className="absolute inset-0 rounded-full bg-(--info)/20 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-(--info)/10 animate-pulse" />
          </>
        )}
        {done ? (
          <Check size={16} strokeWidth={2.5} />
        ) : (
          <Icon size={16} strokeWidth={1.8} />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-center gap-2">
          <span
            className={`
              text-sm font-semibold tracking-tight
              ${done || active ? "text-(--text)" : "text-(--text-muted)"}
            `}
          >
            {config.label}
          </span>
          {done && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-(--success)/15 text-(--success) uppercase tracking-wide">
              Done
            </span>
          )}
        </div>

        {/* Live message */}
        <div className="h-4 mt-1 overflow-hidden">
          {active && (
            <p
              className="text-xs text-(--text-muted) transition-all duration-200"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(4px)",
              }}
            >
              {message}
            </p>
          )}
          {done && (
            <p className="text-xs text-(--success)/70">
              Completed successfully
            </p>
          )}
        </div>
      </div>

      {/* Active progress bar */}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full overflow-hidden bg-(--border)">
          <div className="h-full bg-(--info) rounded-full animate-[progress_2s_ease-in-out_infinite]" />
        </div>
      )}
    </div>
  );
}

// ─── Connector line ──────────────────────────────────────────────────────────
function StepConnector({ done }) {
  return (
    <div className="flex justify-start my-1">
      <div
        className={`ml-5 w-[2px] h-4 rounded-full transition-all duration-700 ${
          done ? "bg-(--success)/40" : "bg-(--border)"
        }`}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BrokerSuccess() {
  const navigate = useNavigate();
  const { broker } = useParams();

  const fetchConnectionStatus = useIntegrationsStore(
    (s) => s.fetchConnectionStatus,
  );
  const brokerState = useIntegrationsStore((s) => s.brokers?.[broker]);
  const loading = brokerState?.loading;

  const brokerInfo = Brokers.get(broker);
  const [step, setStep] = useState(STEPS.CONNECTED);

  const start = useRef(Date.now());
  const executed = useRef(false);

  // Validate broker
  useEffect(() => {
    if (!broker || !brokerInfo) {
      navigate(PAGE_CONFIG.INTEGRATIONS.route, { replace: true });
    }
  }, [broker, brokerInfo, navigate]);

  // Main flow
  useEffect(() => {
    if (loading === undefined || executed.current) return;
    executed.current = true;

    const run = async () => {
      const prevStatus = localStorage.getItem("connectStatus");
      localStorage.removeItem("connectStatus");

      const elapsed = Date.now() - start.current;
      await new Promise((r) => setTimeout(r, Math.max(800 - elapsed, 0)));

      try {
        setStep(STEPS.SYNCING);

        if (prevStatus === "NOT_CONNECTED") {
          await tradeSyncService.fullSync(broker);
        } else {
          await tradeSyncService.incrementalSync(broker);
        }

        setStep(STEPS.PREPARING);
        await dashboardInit();

        await fetchConnectionStatus(broker, true);

        useUIStore
          .getState()
          .showToast(
            "SUCCESS",
            `Your ${brokerInfo.name} account connected successfully`,
          );

        navigate(PAGE_CONFIG.DASHBOARD.route, { replace: true });
      } catch (err) {
        console.error(err);
        useUIStore.getState().showToast("ERROR", "Failed to prepare dashboard");
        navigate(PAGE_CONFIG.INTEGRATIONS.route, { replace: true });
      }
    };

    run();
  }, [loading, broker, brokerInfo, fetchConnectionStatus, navigate]);

  const getStatus = (stepId) => {
    if (step > stepId) return "done";
    if (step === stepId) return "active";
    return "pending";
  };

  return (
    <div className="h-screen bg-(--surface) flex items-center justify-center px-4">
      <div
        className="bg-(--surface-muted) border border-(--border) rounded-xl w-full max-w-sm shadow-lg"
        style={{ boxShadow: "0 8px 35px rgba(0,0,0,0.07)" }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 pt-5 pb-4 px-5 border-b border-(--border)">
          <BrokerLogo imgSrc={brokerInfo?.logo} />

          <div className="text-center space-y-0.5">
            <h2 className="text-sm font-semibold text-(--text)">
              Connecting to {brokerInfo?.name}
            </h2>

            <p className="text-[11px] text-(--text-muted)">
              Please don't close this tab
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="px-5 py-4 space-y-0">
          {STEP_CONFIG.map((config, i) => (
            <div key={config.id}>
              <StepRow config={config} status={getStatus(config.id)} />

              {i < STEP_CONFIG.length - 1 && (
                <StepConnector done={step > config.id} />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pb-4">
          <p className="text-center text-[10px] text-(--text-muted)">
            Securely syncing your account data
          </p>
        </div>

        <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      </div>
    </div>
  );
}
