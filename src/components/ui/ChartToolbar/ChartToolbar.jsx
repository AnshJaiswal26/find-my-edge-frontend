import {
  Download,
  Pin,
  PlusCircle,
  RefreshCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
  Settings2,
} from "lucide-react";
import { IconButton } from "../Buttons";
import { useMemo } from "react";
import ChartFilterPopup from "../ChartFilterPopup";
import { useChartStore } from "@stores";
import {
  handleZoomIn,
  handleZoomOut,
  handleDownloadCSV,
  handleDownloadPNG,
} from "./handlers";

export default function ChartToolbar({
  chartRef,
  chartWrapperRef,
  chartId,
  type,
}) {
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
        onClick: () => handleZoomIn(updateChart, chartWrapperRef, chartId),
      },
      {
        icon: ZoomOut,
        title: "Zoom Out",
        onClick: () => handleZoomOut(updateChart, chartWrapperRef, chartId),
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
          handleDownloadPNG(chartRef);
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
      <IconButton
        className={"icon-button"}
        icon={<Pin />}
        tooltip={{
          title: "Pin Chart",
          position: "bottom",
        }}
        onClick={() => {}}
      />
      <ChartFilterPopup chartId={chartId} />

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
