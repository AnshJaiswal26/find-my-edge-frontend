import React from "react";
import { TradeSetup } from "./components/TradeSetup";
import { useTradeSetupStore } from "@shared/stores";
import { Popups } from "./components/modals";
import { Container } from "@shared/components/layout";
import { Button, NoTradesEmptyState } from "@shared/components/ui";
import { Plus } from "lucide-react";
import { hideTooltip, showTooltip } from "@shared/components/ui/tooltip";

export function SetupRulesToolbar({ count }) {
  const openPopup = useTradeSetupStore((s) => s.openPopup);

  return (
    <Container>
      <div className="flex flex-wrap md:flex-row gap-3 items-center justify-between">
        <span>Total Setups {count}</span>
        <Button.Icon
          onClick={() => openPopup("setup-add")}
          onMouseEnter={(e) => showTooltip(e, "Add Setup")}
          onMouseLeave={hideTooltip}
        >
          <Plus size={18} />
        </Button.Icon>
      </div>
    </Container>
  );
}

export default function SetupRules() {
  const tradeSetupOrder = useTradeSetupStore((s) => s.tradeSetupsOrder);

  return (
    <div className="space-y-8">
      <Popups />
      <SetupRulesToolbar count={tradeSetupOrder.length} />
      {tradeSetupOrder.length === 0 ? (
        <NoTradesEmptyState
          title={"No trades setups available"}
          message={"You don’t have any trade setups to display right now."}
          className={"!min-h-80"}
        />
      ) : (
        tradeSetupOrder.map((id, i) => <TradeSetup key={i} index={i} id={id} />)
      )}
    </div>
  );
}
