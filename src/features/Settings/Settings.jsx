import React, { useState, useEffect } from "react";
import { TabSelector } from "@shared/components/ui";
import "./Settings.css";
import { PerformaceGoalTracking } from "./PerformanceGoalTracking";
import { RiskTracking } from "./RiskTracking";
import { ThemeSettings } from "./ThemeSettings";

function Settings() {
  const [dayProfitTarget, setDayProfitTarget] = useState("0");
  const [maxLossTolerance, setMaxLossTolerance] = useState("0");
  const [riskPerTrade, setRiskPerTrade] = useState("");
  const [isPortfolioRiskEnabled, setIsPortfolioRiskEnabled] = useState(false);
  const [portfolioRiskLimit, setPortfolioRiskLimit] = useState("");
  const [apiMessage, setApiMessage] = useState("");

  const [currentTab, setCurrentTab] = useState("riskTracking");

  useEffect(() => {
    if (apiMessage) {
      const timer = setTimeout(() => setApiMessage(""), 4000); // Clear message after 4 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [apiMessage]);

  const resetGoals = () => {
    setDayProfitTarget("");
    setMaxLossTolerance("");
  };

  return (
    <div className="bg-(--surface)">
      <div className="flex flex-col overflow-auto h-fit max-h-[100vh] text-(--text)">
        <div className="w-full">
          <TabSelector
            tabs={[
              { key: "riskTracking", label: "Risk Tracking" },
              { key: "preformaceGoals", label: "Performance Goals" },
              { key: "theme", label: "Themes" },

              // { key: "notifications", label: "Notifications" },
            ]}
            currentTab={currentTab}
            onClick={(key) => setCurrentTab(key)}
          />
        </div>

        <div className="px-15 py-5">
          {currentTab === "riskTracking" ? (
            <RiskTracking
              riskPerTrade={riskPerTrade}
              setRiskPerTrade={setRiskPerTrade}
              isPortfolioRiskEnabled={isPortfolioRiskEnabled}
              setIsPortfolioRiskEnabled={setIsPortfolioRiskEnabled}
              portfolioRiskLimit={portfolioRiskLimit}
              setPortfolioRiskLimit={setPortfolioRiskLimit}
            />
          ) : currentTab === "preformaceGoals" ? (
            <PerformaceGoalTracking
              dayProfitTarget={dayProfitTarget}
              setDayProfitTarget={setDayProfitTarget}
              maxLossTolerance={maxLossTolerance}
              setMaxLossTolerance={setMaxLossTolerance}
              resetGoals={resetGoals}
            />
          ) : (
            <ThemeSettings />
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
