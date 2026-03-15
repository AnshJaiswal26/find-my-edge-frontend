import { useDashboardStore } from "@features/dashboard/store";
import { useChartStore } from "@modules/charts/apex/store";

import { CustomApexChart } from "@modules/charts";
import { ChartCategory } from "@modules/charts/apex/model/enums";

export default function ChartGridItem({ id, onRemove, ...props }) {
  const savedLayout = useDashboardStore((s) => s.gridLayout?.[id]);

  const { type, category, mode } = useChartStore.getState().charts[id];

  return (
    <div
      className="grid-stack-item"
      gs-id={id}
      gs-x={savedLayout?.x}
      gs-y={savedLayout?.y}
      gs-w={savedLayout?.w ?? (category === ChartCategory.GROUP ? 10 : 15)}
      gs-h={savedLayout?.h ?? 10}
      gs-min-w={category === ChartCategory.GROUP ? 8 : 12}
      gs-min-h={8}
      gs-max-h={100}
    >
      <div className="grid-stack-item-content rounded-[8px] shadow-xl">
        <div className="h-full relative">
          <CustomApexChart
            chartId={id}
            type={type}
            mode={mode}
            category={category}
            onRemove={onRemove}
            {...props}
          />
        </div>
      </div>
    </div>
  );
}
