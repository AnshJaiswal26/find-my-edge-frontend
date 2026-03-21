import React from "react";
import "./SetupRules.css";
import { TradeSetup } from "./components/TradeSetup";
import { EditSetupPopup } from "./components/modals";

export default function SetupRules() {
  return (
    <div className="border">
      <EditSetupPopup />
      <TradeSetup />
    </div>
  );
}
