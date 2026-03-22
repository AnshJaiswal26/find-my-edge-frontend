import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui";

import { ToolbarSection } from "../layout";
import { useTradeSetupStore } from "@shared/stores";
import { hideTooltip, showTooltip } from "@shared/components/ui/tooltip";

function Title({ id }) {
  const name = useTradeSetupStore((s) => s.tradeSetupsById[id].name);
  return <span className="ml-3">{name}</span>;
}

export function Toolbar({ id }) {
  const openPopup = useTradeSetupStore((s) => s.openPopup);

  return (
    <div className="flex flex-row w-full gap-3 h-fit">
      <ToolbarSection className="flex-4 justify-between border-r border-(--border)">
        <Title id={id} />
        <Button.Icon
          className="mr-3"
          onClick={() => openPopup("setup-edit", id)}
          onMouseEnter={(e) => showTooltip(e, "Edit Setup")}
          onMouseLeave={hideTooltip}
        >
          <Pencil size={16} />
        </Button.Icon>
      </ToolbarSection>
      <ToolbarSection className="flex-5 justify-end">
        <Button.Icon
          onClick={() => openPopup("field-add", id)}
          onMouseEnter={(e) => showTooltip(e, "Add Field")}
          onMouseLeave={hideTooltip}
        >
          <Plus size={16} />
        </Button.Icon>
        <Button.Icon
          onMouseEnter={(e) => showTooltip(e, "Delete Setup")}
          onMouseLeave={hideTooltip}
        >
          <Trash2 size={16} />
        </Button.Icon>
      </ToolbarSection>
    </div>
  );
}
