import {
  Download,
  RefreshCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
  Settings2,
  ArrowDownUp,
  Filter,
} from "lucide-react";
import { Button } from "@ui";
import { useChartStore } from "@charts/apex/store/useChartStore";

const seriesChartActions = [
  {
    icon: Filter,
    title: "Filter",
    onClick: (chartId) => useChartStore.getState().openPopup(chartId, "filter"),
  },

  {
    icon: ArrowDownUp,
    title: "Sort",
    onClick: (chartId) => useChartStore.getState().openPopup(chartId, "sort"),
  },
  {
    icon: ZoomIn,
    title: "Zoom In",
    onClick: (chartId) => useChartStore.getState().zoomInChart(chartId),
  },
  {
    icon: ZoomOut,
    title: "Zoom Out",
    onClick: (chartId) => useChartStore.getState().zoomOutChart(chartId),
  },
  {
    icon: RefreshCcw,
    title: "Reset Series",
    onClick: (chartId) => useChartStore.getState().resetSeries(chartId),
  },
];

const commonActions = [
  {
    icon: Settings2,
    title: "Layout",
    onClick: (chartId) => useChartStore.getState().openPopup(chartId, "layout"),
  },
  {
    icon: Download,
    title: "Download",
    onClick: (chartId) => {
      const state = useChartStore.getState();
      state.downloadCSV(chartId);
      state.downloadPNG(chartId);
    },
  },
  {
    icon: Trash2,
    title: "Remove Chart",
    onClick: (chartId) => deleteChart(chartId),
  },
];

export default function Toolbar({ chartId }) {
  const chart = useChartStore.getState()[chartId];

  const isGroupType = chart.meta.category === "group";

  const iconButtonsBar = isGroupType
    ? commonActions
    : [...seriesChartActions, ...commonActions];

  return (
    <div className="apexcharts-custom-toolbar">
      {iconButtonsBar.map((item, index) => (
        <Button.Icon
          key={index}
          tooltip={{ text: item.title, position: "left" }}
          onClick={() => item?.onClick?.(chartId)}
        >
          <item.icon size={16} className="text-inherit" />
        </Button.Icon>
      ))}
    </div>
  );
}
