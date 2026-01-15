import { useMemo } from "react";
import {
  Download,
  PlusCircle,
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

export default function Toolbar({ chartId }) {
  const {
    openPopup,
    zoomInChart,
    zoomOutChart,
    resetSeries,
    downloadPNG,
    downloadCSV,
    deleteChart,
    [chartId]: chart,
  } = useChartStore.getState();

  const isGroupType = chart.meta.category === "group";

  const IconCmpt = useMemo(
    () => [
      {
        icon: Filter,
        title: "Filter",
        onClick: () => openPopup(chartId, "filter"),
      },

      {
        icon: ArrowDownUp,
        title: "Sort",
        onClick: () => openPopup(chartId, "sort"),
      },

      {
        icon: Settings2,
        title: "Layout",
        onClick: () => openPopup(chartId, "layout"),
      },
      {
        icon: PlusCircle,
        title: "Manage Series",
        onClick: () => openPopup(chartId, "manage-series"),
      },
      ...(isGroupType
        ? []
        : [
            {
              icon: ZoomIn,
              title: "Zoom In",
              onClick: () => zoomInChart(chartId),
            },
            {
              icon: ZoomOut,
              title: "Zoom Out",
              onClick: () => zoomOutChart(chartId),
            },
            {
              icon: RefreshCcw,
              title: "Reset Series",
              onClick: () => resetSeries(chartId),
            },
          ]),
      {
        icon: Download,
        title: "Download",
        onClick: () => {
          downloadCSV(chartId);
          downloadPNG(chartId);
        },
      },
      {
        icon: Trash2,
        title: "Remove Chart",
        onClick: () => deleteChart(chartId),
      },
    ],
    []
  );

  return (
    <div className="apexcharts-custom-toolbar">
      {/* {!isGroupType && <FilterPopup chartId={chartId} />} */}

      {IconCmpt.map((item, index) => (
        <Button.Icon
          key={index}
          tooltip={{ text: item.title, position: "left" }}
          onClick={() => item?.onClick?.()}
        >
          <item.icon size={16} className="text-inherit" />
        </Button.Icon>
      ))}
    </div>
  );
}
