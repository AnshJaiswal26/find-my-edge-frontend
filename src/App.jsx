import { Routes, Route, Outlet } from "react-router-dom";

import { PageContainer } from "@shared/components/layout";

import Dashboard from "./features/dashboard/Dashboard";
import TradeMetrics from "./features/trade-metrics/TradeMetrics";
import SheetIntegration from "./features/sheet-integration/SheetIntegration";
import YearlyCalendar from "./features/calander/YearlyCalendar";
import CapturedStrategies from "./features/captured-strategies/CapturedStrategies";
import SetupRules from "./features/setups-rules/SetupRules";
import Settings from "./features/settings/Settings";
import Mistakes from "./features/mistakes/Mistakes";
import RiskManagement from "./features/risk-management/RiskManagement";
import IntegrationsPage from "./features/integrations/Integrations";

import BrokerSuccess from "@features/integrations/brokers/success/BrokerSuccess";

import OfflinePage from "@pages/system/offlinePage";
import ServerUnavailablePage from "@pages/system/ServerUnavailablePage";

import { PAGE_CONFIG } from "@config/pages/pageConfig";

import { useAppBootstrap } from "@lib/bootstrap/useAppBootstrap";
import { Loader } from "@shared/components/ui";
import { useEffect } from "react";
import { useUIStore } from "@shared/stores";

function AppGate({ children }) {
  const loading = useAppBootstrap();

  if (loading) {
    return <Loader />;
  }

  return children;
}

function Layout() {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
}

function AppRoutes() {
  useEffect(() => {
    const { setSelect, setColorPicker } = useUIStore.getState();

    const close = () => {
      setSelect(null);
      setColorPicker(null);
    };

    const handlePointerDown = (e) => {
      const { activeSelect, activeColorPicker } = useUIStore.getState();

      if (!activeSelect && !activeColorPicker) return;

      const buttonEl = document.getElementById(activeSelect?.buttonId);
      const listEl = document.getElementById(activeSelect?.listId);
      const triggerEl = document.getElementById(activeColorPicker?.triggerId);
      const paletteEl = document.getElementById(activeColorPicker?.paletteId);

      if (
        buttonEl?.contains(e.target) ||
        listEl?.contains(e.target) ||
        triggerEl?.contains(e.target) ||
        paletteEl?.contains(e.target)
      ) {
        return;
      }

      close();
    };

    const handleVisibility = () => {
      if (document.hidden) close();
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", close);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("scroll", handlePointerDown, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", close);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("scroll", handlePointerDown); // ✅ FIXED
    };
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={PAGE_CONFIG.DASHBOARD.route} element={<Dashboard />} />
        <Route
          path={PAGE_CONFIG.TRADE_METRICS.route}
          element={<TradeMetrics />}
        />
        <Route path={PAGE_CONFIG.CALENDAR.route} element={<YearlyCalendar />} />
        <Route path={PAGE_CONFIG.SETUP_RULES.route} element={<SetupRules />} />
        <Route
          path={PAGE_CONFIG.CAPTURED_STRATEGIES.route}
          element={<CapturedStrategies />}
        />
        <Route path={PAGE_CONFIG.SETTINGS.route} element={<Settings />} />
        <Route path={PAGE_CONFIG.MISTAKES.route} element={<Mistakes />} />
        <Route
          path={PAGE_CONFIG.RISK_MANAGEMENT.route}
          element={<RiskManagement />}
        />
        <Route
          path={PAGE_CONFIG.INTEGRATIONS.route}
          element={<IntegrationsPage />}
        />
      </Route>

      <Route path="/integrations/success/:broker" element={<BrokerSuccess />} />

      <Route path="/offline" element={<OfflinePage />} />
      <Route path="/server-unavailable" element={<ServerUnavailablePage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppGate>
      <AppRoutes />
    </AppGate>
  );
}
