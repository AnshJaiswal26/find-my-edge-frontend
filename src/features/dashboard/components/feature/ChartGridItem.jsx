import { useDashboardStore } from "@features/dashboard/store";
import { useChartStore } from "@modules/charts/apex/store";

import { CustomApexChart } from "@modules/charts";
import { ChartCategory } from "@modules/charts/apex/model/enums";
import { useGridStackWidget } from "@shared/hooks/index.js";

export default function ChartGridItem(props) {
  const { id, grid } = props;

  const savedLayout = useDashboardStore((s) => s.gridLayout?.[id]);

  const { type, category, mode } = useChartStore.getState().charts[id];

  const initWidget = useGridStackWidget(grid);

  return (
    <div
      ref={initWidget}
      className="grid-stack-item"
      gs-id={props.id}
      gs-x={savedLayout?.x}
      gs-y={savedLayout?.y}
      gs-w={savedLayout?.w ?? (category === ChartCategory.PARTITION ? 10 : 15)}
      gs-h={savedLayout?.h ?? 10}
      gs-min-w={category === ChartCategory.PARTITION ? 8 : 12}
      gs-min-h={8}
      gs-max-h={100}
    >
      <div className="grid-stack-item-content rounded-[8px] shadow-xl">
        <div className="h-full relative">
          <CustomApexChart
            chartId={props.id}
            type={type}
            mode={mode}
            category={category}
            {...props}
          />
        </div>
      </div>
    </div>
  );
}
