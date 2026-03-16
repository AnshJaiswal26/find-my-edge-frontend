import { ChartCategory } from "@modules/charts/apex/model/enums";
import { DownloadButton } from "./DownloadButton";
import { FilterButton } from "./FilterButton";
import { LayoutButton } from "./LayoutButton";
import { RemoveButton } from "./RemoveButton";
import { ResetSeriesButton } from "./ResetSeriesButton";
import { SortButton } from "./SortButton";
import { ZoomInButton } from "./ZoomInButton";
import { ZoomOutButton } from "./ZoomOutButton";

import { useChartStore } from "@modules/charts/apex/store";

export default function Toolbar({ chartId, onRemove }) {
  const chart = useChartStore((s) => s.charts[chartId]);

  const isGroupType =
    chart.category === ChartCategory.PARTITION ||
    chart.category === ChartCategory.RADIAL_AXIS;

  return (
    <div className="apexcharts-custom-toolbar">
      {!isGroupType && (
        <>
          <FilterButton chartId={chartId} />
          <SortButton chartId={chartId} />
          <ZoomInButton chartId={chartId} />
          <ZoomOutButton chartId={chartId} />
          <ResetSeriesButton chartId={chartId} />
        </>
      )}

      <LayoutButton chartId={chartId} />
      <DownloadButton chartId={chartId} />
      <RemoveButton chartId={chartId} onRemove={onRemove} />
    </div>
  );
}
