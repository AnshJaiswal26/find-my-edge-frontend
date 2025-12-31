import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { pageRoute } from "@data";
import { Loader, PageContainer } from "@layout";
import { useUIStore } from "@stores";

// Lazy import each page
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const TradeMetrics = lazy(() =>
  import("./features/trade-metrics/TradeMetrics")
);
const SheetIntegration = lazy(() =>
  import("./features/sheet-integration/SheetIntegration")
);

const YearlyCalendar = lazy(() => import("./features/calander/YearlyCalendar"));
const CapturedStrategies = lazy(() =>
  import("./features/captured-strategies/CapturedStrategies")
);
const SetupRules = lazy(() => import("./features/setups-rules/SetupRules"));
const Settings = lazy(() => import("./features/settings/Settings"));
const Mistakes = lazy(() => import("./features/mistakes/Mistakes"));
const RiskManagement = lazy(() =>
  import("./features/risk-management/RiskManagement")
);

function Layout() {
  return (
    <PageContainer>
      <Outlet />
    </PageContainer>
  );
}

const withSuspense = (Component) => {
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

function App() {
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
      const palleteEl = document.getElementById(activeColorPicker?.paletteId);

      if (
        buttonEl?.contains(e.target) ||
        listEl?.contains(e.target) ||
        triggerEl?.contains(e.target) ||
        palleteEl?.contains(e.target)
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
      window.addEventListener("scroll", handlePointerDown);
    };
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path={pageRoute.dashboard} element={<Dashboard />} />
          <Route path={pageRoute.tradeMetrics} element={<TradeMetrics />} />
          <Route
            path={pageRoute.sheetIntegration}
            element={<SheetIntegration />}
          />
          <Route path={pageRoute.calendar} element={<YearlyCalendar />} />
          <Route path={pageRoute.setupRules} element={<SetupRules />} />
          <Route
            path={pageRoute.capturedStrategies}
            element={<CapturedStrategies />}
          />
          <Route path={pageRoute.settings} element={<Settings />} />
          <Route path={pageRoute.mistakes} element={<Mistakes />} />
          <Route path={pageRoute.riskManagement} element={<RiskManagement />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
