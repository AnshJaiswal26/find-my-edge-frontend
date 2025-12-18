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
    const setActiveSelector = useUIStore.getState().setActiveSelector;

    const handleBlur = () => {
      setActiveSelector(null);
    };

    const handleGlobalClose = (e) => {
      const activeSelector = useUIStore.getState().activeSelector;
      // If dropdown isn’t open → skip
      if (activeSelector === null) return;

      // If click was inside button or list → ignore
      if (
        e.target?.id === activeSelector?.buttonId ||
        e.target?.id === activeSelector?.listId
      )
        return;

      setActiveSelector(null);
    };

    window.addEventListener("mousedown", handleGlobalClose);
    window.addEventListener("resize", handleBlur);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("scroll", handleGlobalClose, true);
    document.addEventListener("visibilitychange", handleBlur);

    return () => {
      window.removeEventListener("mousedown", handleGlobalClose);
      window.removeEventListener("resize", handleBlur);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("scroll", handleGlobalClose, true);
      document.removeEventListener("visibilitychange", handleBlur);
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
