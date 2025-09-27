import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Dashboard,
  Edge,
  CustomJournal,
  CustomEdge,
  TradingJournal,
  YearlyCalendar,
  SetupRules,
  Settings,
  Backtest,
  Mistakes,
  RiskManagement,
} from "./features";
import "./styles/utilities.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />{" "}
      <Route path="/edge" element={<Edge />} />
      <Route path="/custom-journal" element={<CustomJournal />} />{" "}
      <Route path="/custom-edge" element={<CustomEdge />} />{" "}
      <Route path="/trading-journal" element={<TradingJournal />} />{" "}
      <Route path="/yearly-calendar" element={<YearlyCalendar />} />{" "}
      <Route path="/setup-rules" element={<SetupRules />} />{" "}
      <Route path="/backtest" element={<Backtest />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/mistakes" element={<Mistakes />} />
      <Route path="/risk-management" element={<RiskManagement />} />
    </Routes>
  );
}
export default App;
