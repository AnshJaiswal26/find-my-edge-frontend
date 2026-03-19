import { CHART_CATEGORY } from "@modules/charts/apex/model/enums";
import { DownloadButton } from "./DownloadButton";
import { FilterButton } from "./FilterButton";
import { LayoutButton } from "./LayoutButton";
import { RemoveButton } from "./RemoveButton";
import { ResetSeriesButton } from "./ResetSeriesButton";
import { SortButton } from "./SortButton";
import { ZoomInButton } from "./ZoomInButton";
import { ZoomOutButton } from "./ZoomOutButton";

export default function Toolbar({ chartId, category }) {
  const isGroupType =
    category === CHART_CATEGORY.PARTITION ||
    category === CHART_CATEGORY.RADIAL_AXIS;

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
      <RemoveButton chartId={chartId} />
    </div>
  );
}
