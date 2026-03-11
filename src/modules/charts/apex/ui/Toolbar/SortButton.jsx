import { useChartStore } from "@modules/charts/apex/store";
import { ToolbarButton } from "./ToolbarButton";
import { ArrowDownUp } from "lucide-react";

export function SortButton({ chartId }) {
  const openPopup = useChartStore((s) => s.openPopup);
  const active = useChartStore(
    (s) => s.charts[chartId].sort.operator !== "none",
  );

  return (
    <ToolbarButton
      icon={ArrowDownUp}
      title="Sort"
      active={active}
      onClick={() => openPopup(chartId, "sort")}
    />
  );
}
