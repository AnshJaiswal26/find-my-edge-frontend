import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { PageContainer } from "@shared/components/layout";
import { Loader } from "@shared/components/ui";

import { useAppBootstrap } from "@lib/bootstrap/useAppBootstrap";
import { ProtectedRoute } from "@lib/auth/ProtectedRoute";

import Dashboard from "@features/dashboard/Dashboard.jsx";
import TradeMetrics from "@features/trade-metrics/TradeMetrics";
import SheetIntegration from "@features/sheet-integration/SheetIntegration";
import YearlyCalendar from "@features/calander/YearlyCalendar";
import CapturedStrategies from "@features/captured-strategies/CapturedStrategies";
import SetupRules from "@features/setups-rules/SetupRules";
import Settings from "@features/settings/Settings";
import Mistakes from "@features/mistakes/Mistakes";
import RiskManagement from "@features/risk-management/RiskManagement";
import IntegrationsPage from "@features/integrations/Integrations";

import BrokerSuccess from "@features/integrations/brokers/success/BrokerSuccess";

import Login from "@pages/public/LoginPage";
import Register from "@pages/public/RegisterPage";

import OfflinePage from "@pages/system/offlinePage";
import ServerUnavailablePage from "@pages/system/ServerUnavailablePage";

import { PAGE_CONFIG } from "@pages/config/pageConfig";
import { useAuthStore } from "@shared/stores";

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

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
  // useGlobalUIClose();

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* PROTECTED APP */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
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

        <Route
          path={PAGE_CONFIG.SHEET_INTEGRATION?.route}
          element={
            <ProtectedRoute>
              <SheetIntegration />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* BROKER OAUTH SUCCESS */}
      <Route path="/integrations/success/:broker" element={<BrokerSuccess />} />

      {/* SYSTEM ROUTES */}
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
