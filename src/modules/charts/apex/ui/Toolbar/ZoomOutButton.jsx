import { useChartStore } from "@modules/charts/apex/store";
import { ToolbarButton } from "./ToolbarButton";
import { ZoomOut } from "lucide-react";

export function ZoomOutButton({ chartId }) {
  const zoomOutChart = useChartStore((s) => s.zoomOutChart);

  return (
    <ToolbarButton
      icon={ZoomOut}
      title="Zoom Out"
      onClick={() => zoomOutChart(chartId)}
    />
  );
}
