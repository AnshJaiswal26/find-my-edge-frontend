import { useChartStore } from "@modules/charts/apex/store";
import { ToolbarButton } from "./ToolbarButton";
import { RefreshCcw } from "lucide-react";

export function ResetSeriesButton({ chartId }) {
  const resetSeries = useChartStore((s) => s.resetSeries);

  return (
    <ToolbarButton
      icon={RefreshCcw}
      title="Reset Series"
      onClick={() => resetSeries(chartId)}
    />
  );
}
