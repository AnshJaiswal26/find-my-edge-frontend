import { useChartStore } from "@modules/charts/apex/store";
import { ToolbarButton } from "./ToolbarButton";
import { ZoomIn } from "lucide-react";

export function ZoomInButton({ chartId }) {
  const zoomInChart = useChartStore((s) => s.zoomInChart);

  return (
    <ToolbarButton
      icon={ZoomIn}
      title="Zoom In"
      onClick={() => zoomInChart(chartId)}
    />
  );
}
