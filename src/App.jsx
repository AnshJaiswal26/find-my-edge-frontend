import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { pageRoute } from "@data";
import { PageContainer } from "@layout";
import { Loader2 } from "lucide-react";

// Lazy import each page
const Dashboard = lazy(() => import("./features/dashboard/Dashboard"));
const Edge = lazy(() => import("./features/Edge/Edge"));
const CustomJournal = lazy(() => import("./features/Edge/Edge"));
const CustomEdge = lazy(() => import("./features/CustomRecords/CustomEdge"));
const TradingJournal = lazy(() =>
  import("./features/TradingJournal/TradingJournal")
);
const YearlyCalendar = lazy(() =>
  import("./features/YearlyCalendar/YearlyCalendar")
);
const SetupRules = lazy(() => import("./features/SetupRules/SetupRules"));
const Backtest = lazy(() => import("./features/CustomRecords/backtest"));
const Settings = lazy(() => import("./features/Settings/Settings"));
const Mistakes = lazy(() => import("./features/Mistakes/Mistakes"));
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

function Loader() {
  return (
    <div className="flex w-[100vw] h-[100vh] items-center justify-center">
      <Loader2
        size={60}
        className="animate-spin"
        color="var(--color-text-heading)"
      />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path={pageRoute.dashboard} element={<Dashboard />} />
          <Route path={pageRoute.edge} element={<Edge />} />
          <Route path={pageRoute.customJournal} element={<CustomJournal />} />
          <Route path={pageRoute.customEdge} element={<CustomEdge />} />
          <Route path={pageRoute.tradingJournal} element={<TradingJournal />} />
          <Route path={pageRoute.calendar} element={<YearlyCalendar />} />
          <Route path={pageRoute.setupRules} element={<SetupRules />} />
          <Route path={pageRoute.backtest} element={<Backtest />} />
          <Route path={pageRoute.settings} element={<Settings />} />
          <Route path={pageRoute.mistakes} element={<Mistakes />} />
          <Route path={pageRoute.riskManagement} element={<RiskManagement />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
