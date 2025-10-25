import {
  BoxSelect,
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
  handleSelectionClick,
  handleReset,
  handleDownloadCSV,
  handleDownloadPNG,
} from "./handlers";

export default function ChartToolbar({
  chartRef,
  chartWrapperRef,
  chartId,
  type,
}) {
  const updateSeries = useChartStore((s) => s.updateSeries);
  const updateLayout = useChartStore((s) => s.updateLayout);

  const deleteChart = useChartStore((s) => s.deleteChart);

  const updateActiveChart = useChartStore((s) => s.updateActiveChart);

  const IconCmpt = useMemo(
    () => [
      {
        icon: Settings2,
        title: "Layout",
        onClick: () => {
          updateActiveChart({ id: chartId, type });
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
        onClick: () => handleZoomIn(updateLayout, chartWrapperRef, chartId),
      },
      {
        icon: ZoomOut,
        title: "Zoom Out",
        onClick: () => handleZoomOut(updateLayout, chartWrapperRef, chartId),
      },
      {
        icon: BoxSelect,
        title: "Selection",
        onClick: () => handleSelectionClick(chartRef),
      },
      {
        icon: RefreshCcw,
        title: "Reset Series",
        onClick: () => handleReset(chartId, updateSeries),
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
          deleteChart(chartId);
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
