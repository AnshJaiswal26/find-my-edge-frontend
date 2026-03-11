import { useChartStore } from "@modules/charts/apex/store";
import { ToolbarButton } from "./ToolbarButton";
import { Filter } from "lucide-react";

export function FilterButton({ chartId }) {
  const openPopup = useChartStore((s) => s.openPopup);
  const length = useChartStore((s) => s.charts[chartId].filters.length);

  return (
    <ToolbarButton
      icon={Filter}
      title="Filter"
      active={!!length}
      onClick={() => openPopup(chartId, "filter")}
    />
  );
}
