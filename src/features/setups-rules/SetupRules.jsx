import React from "react";
import "./SetupRules.css";
import { TradeSetup } from "./components/TradeSetup";
import { useTradeSetupStore } from "@shared/stores";
import { Popups } from "./components/modals";

export default function SetupRules() {
  const tradeSetupOrder = useTradeSetupStore((s) => s.tradeSetupsOrder);

  return (
    <div className="border">
      <Popups />
      {tradeSetupOrder.map((id, i) => (
        <TradeSetup key={i} index={i} id={id} />
      ))}
    </div>
  );
}
