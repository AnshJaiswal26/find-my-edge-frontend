import { Trash2 } from "lucide-react";
import { ToolbarButton } from "./ToolbarButton";

export function RemoveButton({ chartId, onRemove }) {
  return (
    <ToolbarButton
      icon={Trash2}
      title="Remove Chart"
      onClick={(e) => onRemove?.(chartId, e)}
    />
  );
}
