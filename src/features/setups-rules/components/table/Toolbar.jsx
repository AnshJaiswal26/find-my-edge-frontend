import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@shared/components/ui";
import { useTradeSetupStore } from "@shared/stores";
import { hideTooltip, showTooltip } from "@shared/components/ui/tooltip";
import { confirmManager } from "@shared/components/ui/managers";
import { toast } from "@shared/services/toast.service";

function Title({ id }) {
  const name = useTradeSetupStore((s) => s.tradeSetupsById[id].name);
  return <span>{name}</span>;
}

export function Toolbar({ id }) {
  const openPopup = useTradeSetupStore((s) => s.openPopup);
  const deleteTradeSetup = useTradeSetupStore((s) => s.deleteTradeSetup);

  return (
    <div className="flex items-center justify-between w-full gap-3 h-fit">
      <Title id={id} />
      <div className="flex gap-2">
        <Button.Icon
          onClick={() => openPopup("setup-edit", id)}
          onMouseEnter={(e) => showTooltip(e, { content: "Edit Setup" })}
          onMouseLeave={hideTooltip}
        >
          <Pencil size={16} />
        </Button.Icon>
        <Button.Icon
          onClick={() => openPopup("field-add", id)}
          onMouseEnter={(e) => showTooltip(e, { content: "Add Field" })}
          onMouseLeave={hideTooltip}
        >
          <Plus size={16} />
        </Button.Icon>
        <Button.Icon
          onClick={() => {
            confirmManager.confirm({
              title: "Delete Setup",
              danger: true,
              message: "Are you sure you want to delete this setup ?",
              onConfirm: async () => {
                await deleteTradeSetup(id);
              },
              onError: (e) => toast.error(e.message),
            });
          }}
          onMouseEnter={(e) => showTooltip(e, { content: "Delete Setup" })}
          onMouseLeave={hideTooltip}
        >
          <Trash2 size={16} />
        </Button.Icon>
      </div>
    </div>
  );
}
