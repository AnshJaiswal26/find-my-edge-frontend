import { useChartStore } from "@modules/charts/apex/store";
import { ToolbarButton } from "./ToolbarButton";
import { Settings2 } from "lucide-react";

export function LayoutButton({ chartId }) {
  const openPopup = useChartStore((s) => s.openPopup);

  return (
    <ToolbarButton
      icon={Settings2}
      title="Layout"
      onClick={() => openPopup(chartId, "layout")}
    />
  );
}
