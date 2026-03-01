import { useDashboardStore } from "@features/dashboard/store";
import { useChartStore } from "@modules/charts/apex/store";

import { CustomApexChart } from "@modules/charts";

export default function ChartGridItem({ id, ...props }) {
  const savedLayout = useDashboardStore((s) => s.chartGridLayout?.[id]);
  const deleteChart = useDashboardStore((s) => s.deleteChart);

  const { type, category } = useChartStore.getState().charts[id].meta;

  return (
    <div
      className="grid-stack-item"
      gs-id={id}
      gs-x={savedLayout?.x}
      gs-y={savedLayout?.y}
      gs-w={savedLayout?.w ?? (category === "group" ? 10 : 20)}
      gs-h={savedLayout?.h ?? 10}
      gs-min-w={category === "group" ? 8 : 12}
      gs-min-h={8}
      gs-max-h={100}
    >
      <div className="grid-stack-item-content rounded-[8px] shadow-xl">
        <div className="h-full relative">
          <CustomApexChart
            chartId={id}
            type={type}
            category={category}
            onRemove={deleteChart}
            {...props}
          />
        </div>
      </div>
    </div>
  );
}
