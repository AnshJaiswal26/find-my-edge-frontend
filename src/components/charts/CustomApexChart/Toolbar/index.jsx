import { useMemo } from "react";
import {
  Download,
  PlusCircle,
  RefreshCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
  Settings2,
} from "lucide-react";
import { IconButton } from "@ui";
import { FilterPopup } from "../Popups";
import { useChartStore } from "@stores";
import {
  handleZoomIn,
  handleZoomOut,
  handleDownloadCSV,
  handleDownloadPNG,
} from "./handlers";

export default function Toolbar({ chartRef, chartId, type }) {
  const updateChart = useChartStore((s) => s.updateChart);

  const IconCmpt = useMemo(
    () => [
      {
        icon: Settings2,
        title: "Layout",
        onClick: () => {
          updateChart((s) => {
            s.charts.activeChart.id = chartId;
            s.charts.activeChart.type = type;
          });
          document.body.style.overflow = "hidden";
        },
      },
      {
        icon: PlusCircle,
        title: "Add Series",
        onClick: () => {},
      },
      {
        icon: ZoomIn,
        title: "Zoom In",
        onClick: () => handleZoomIn(updateChart, chartId),
      },
      {
        icon: ZoomOut,
        title: "Zoom Out",
        onClick: () => handleZoomOut(updateChart, chartId),
      },
      {
        icon: RefreshCcw,
        title: "Reset Series",
        onClick: () =>
          updateChart(chartId, (chart) => {
            chart.filteredSeries = chart.originalSeries;
          }),
      },
      {
        icon: Download,
        title: "Download",
        onClick: () => {
          handleDownloadCSV(chartId);
          handleDownloadPNG(chartId);
        },
      },
      {
        icon: Trash2,
        title: "Remove Chart",
        onClick: () => {
          updateChart((s) => delete s.chart[chartId]);
        },
      },
    ],
    [chartRef, chartId]
  );

  return (
    <div className="apexcharts-custom-toolbar">
      <FilterPopup chartId={chartId} />

      {IconCmpt.map((item, index) => (
        <IconButton
          className={"icon-button"}
          key={index}
          icon={<item.icon />}
          tooltip={{ title: item.title, position: "bottom" }}
          onClick={() => (item?.onClick ? item.onClick() : {})}
        />
      ))}
    </div>
  );
}
