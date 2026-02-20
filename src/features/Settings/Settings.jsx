import React, { useState, useEffect } from "react";
import { TabSelector } from "@ui";
import "./Settings.css";
import { BrokerIntegration } from "./BrokerIntegration";
import { PerformaceGoalTracking } from "./PerformanceGoalTracking";
import { RiskTracking } from "./RiskTracking";
import { ThemeSettings } from "./ThemeSettings";

function Settings() {
  const [dayProfitTarget, setDayProfitTarget] = useState("0");
  const [maxLossTolerance, setMaxLossTolerance] = useState("0");
  const [riskPerTrade, setRiskPerTrade] = useState("");
  const [isPortfolioRiskEnabled, setIsPortfolioRiskEnabled] = useState(false);
  const [portfolioRiskLimit, setPortfolioRiskLimit] = useState("");
  const [apiKeys, setApiKeys] = useState([]);
  const [apiMessage, setApiMessage] = useState("");

  const [showVerification, setShowVerification] = useState({}); // New state for managing verification visibility

  const [currentTab, setCurrentTab] = useState("riskTracking");

  useEffect(() => {
    if (apiMessage) {
      const timer = setTimeout(() => setApiMessage(""), 4000); // Clear message after 4 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [apiMessage]);

  const brokers = [
    { name: "Dhan", logo: "Icons/broker/dhan.png" },
    { name: "Angel One", logo: "Icons/broker/angel one.png" },
    { name: "Groww", logo: "Icons/broker/groww.png" },
    { name: "Upstox", logo: "Icons/broker/upstox.png" },
    { name: "Zerodha Kite", logo: "Icons/broker/zerodha kite.png" },
  ];

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
              { key: "brokerIntegrations", label: "Broker Integrations" },
              { key: "theme", label: "Themes" },

              // { key: "notifications", label: "Notifications" },
            ]}
            currentTab={currentTab}
            onClick={(key) => setCurrentTab(key)}
          />
        </div>

        <div className="settings-content">
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
          ) : currentTab === "brokerIntegrations" ? (
            <BrokerIntegration
              brokers={brokers}
              apiKeys={apiKeys}
              showVerification={showVerification}
              apiMessage={apiMessage}
              setApiKeys={setApiKeys}
              setShowVerification={setShowVerification}
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
