import { Trash2 } from "lucide-react";
import { ToolbarButton } from "./ToolbarButton";
import { chartEngine } from "../../model/chartEngine";

export function RemoveButton({ chartId }) {
  return (
    <ToolbarButton
      icon={Trash2}
      title="Remove Chart"
      onClick={() => chartEngine.remove(chartId)}
    />
  );
}
