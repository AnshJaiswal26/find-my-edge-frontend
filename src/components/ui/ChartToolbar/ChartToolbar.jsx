import {
  BoxSelect,
  Download,
  FunctionSquareIcon,
  Pin,
  RefreshCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
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
import ChartLayoutPopup from "../ChartLayoutPopup";

export default function ChartToolbar({ chartRef, chartWrapperRef, chartId }) {
  const updateSeries = useChartStore((s) => s.updateSeries);
  const updateLayout = useChartStore((s) => s.updateLayout);

  const IconCmpt = useMemo(
    () => [
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
          handleDownloadCSV(chartId);
          handleDownloadPNG(chartRef);
        },
      },
    ],
    [chartRef, chartId, updateSeries, updateLayout]
  );

  return (
    <div className="flex-box gap-0 bg-[inherit]]  mr-[20px] z-100">
      <IconButton
        className="rounded-none"
        icon={<Pin size={15} />}
        tooltip={{
          title: "Pin Chart",
          position: "bottom",
        }}
        onClick={() => {}}
      />
      <ChartLayoutPopup chartId={chartId} />
      <IconButton
        className="rounded-none"
        icon={<FunctionSquareIcon size={15} />}
        tooltip={{ title: "Function", position: "bottom" }}
        onClick={() => {}}
      />
      <ChartFilterPopup chartId={chartId} />

      {IconCmpt.map((item, index) => (
        <IconButton
          key={index}
          className={"rounded-none"}
          icon={<item.icon size={15} />}
          tooltip={{ title: item.title, position: "bottom" }}
          onClick={() => (item?.onClick ? item.onClick() : {})}
        />
      ))}
    </div>
  );
}
