import { useClearLogic } from "../hooks";
import { Button } from "@shared/components/ui";
import { hideTooltip, showTooltip } from "@shared/components/ui/tooltip";
import { RefreshCcw } from "lucide-react";

export function ResetInputsButton({ sectionName }) {
  const clearSection = useClearLogic();

  return (
    <Button.Icon
      onClick={() => clearSection(sectionName)}
      onMouseEnter={(e) => showTooltip(e, { content: "Reset Inputs" })}
      onMouseLeave={hideTooltip}
    >
      <RefreshCcw size={13} />
    </Button.Icon>
  );
}
