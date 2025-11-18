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

export default function Toolbar({ chartId, type }) {
  const updateChart = useChartStore((s) => s.updateChart);

  const chartMeta = useChartStore.getState()[chartId].meta;

  const isGroupType = chartMeta.category === "group";

  const IconCmpt = useMemo(
    () => [
      {
        icon: Settings2,
        title: "Layout",
        onClick: () => {
          updateChart((s) => {
            s.activeChart.id = chartId;
            s.activeChart.type = type;
            s.activeChart.activePopup = "Layout";
          });
          document.body.style.overflow = "hidden";
        },
      },
      {
        icon: PlusCircle,
        title: "Manage Series",
        onClick: () => {
          updateChart((s) => {
            s.activeChart.id = chartId;
            s.activeChart.type = type;
            s.activeChart.activePopup = "ManageSeries";
          });
          document.body.style.overflow = "hidden";
        },
      },
      ...(isGroupType
        ? []
        : [
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
                  chart.series.filtered = chart.series.default;
                }),
            },
          ]),
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
          updateChart((s) => {
            delete s[chartId];
            s.order = s.order.filter(({ id }) => id !== chartId);
          });
        },
      },
    ],
    []
  );

  return (
    <div className="apexcharts-custom-toolbar">
      {!isGroupType && <FilterPopup chartId={chartId} />}

      {IconCmpt.map((item, index) => (
        <IconButton
          className={"icon-button"}
          key={index}
          icon={<item.icon />}
          tooltipContent={item.title}
          tooltipPosition={"left"}
          onClick={() => (item?.onClick ? item.onClick() : {})}
        />
      ))}
    </div>
  );
}
