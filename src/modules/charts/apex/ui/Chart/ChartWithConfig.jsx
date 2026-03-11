import { ChartLegend } from "./ChartLegend";
import { ChartViewportWrapper } from "./ChartViewport";
import { useChartStore } from "@modules/charts/apex/store";

export function ChartWithConfig({
  chartId,
  type,
  category,
  groups,
  groupSpec,
  selectedGroupIndex,
  ids,
  seriesSelector,
}) {
  const layout = useChartStore((s) => s.charts[chartId].layout);
  const seriesConfig = useChartStore((s) => s.charts[chartId].series);

  const positionClass =
    layout.legendPosition === "bottom" ? "flex-col-reverse" : "flex-col";

  return (
    <div className={`flex flex-1 min-w-0 w-full h-full ${positionClass}`}>
      <ChartLegend
        chartId={chartId}
        type={type}
        show={layout.legend}
        alignment={layout.legendAlignment}
        seriesConfig={seriesConfig}
      />

      <ChartViewportWrapper
        type={type}
        category={category}
        chartId={chartId}
        layout={layout}
        seriesConfig={seriesConfig}
        groups={groups}
        groupSpec={groupSpec}
        selectedGroupIndex={selectedGroupIndex}
        ids={ids}
        seriesSelector={seriesSelector}
      />
    </div>
  );
}
