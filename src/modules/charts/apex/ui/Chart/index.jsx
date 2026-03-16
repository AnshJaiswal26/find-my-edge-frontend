import { useChartStore } from "@modules/charts/apex/store";
import Toolbar from "../Toolbar";
import { ChartContainer } from "./ChartContainer";
import { ChartTitle } from "./ChartTitle";
import { ChartWithConfig } from "./ChartWithConfig";
import { Loader, Skeleton } from "@shared/components/ui";
import { useEffect, useState } from "react";

import { ChartCategory, ChartMode } from "@modules/charts/apex/model/enums";
import { GroupOptionSelect } from "./GroupOptionsSelect";

export default function CustomApexChart({
  chartId,
  type,
  category,
  mode,
  schemasById,
  onRemove,
  ids,
  seriesSelector,
}) {
  const groupSpec = useChartStore((s) => s.charts[chartId]?.groupSpec);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <ChartContainer chartId={chartId}>
      <div className="flex items-center justify-between">
        <ChartTitle chartId={chartId} />
        {category !== ChartCategory.PARTITION &&
          mode === ChartMode.GROUP_SELECT && (
            <GroupOptionSelect
              chartId={chartId}
              groupSpec={groupSpec}
              schemasById={schemasById}
            />
          )}
      </div>

      <div className="flex h-full w-full relative">
        {!ready ? (
          <Loader className="!w-full !h-full" />
        ) : (
          <>
            <ChartWithConfig
              chartId={chartId}
              type={type}
              category={category}
              ids={ids}
              seriesSelector={seriesSelector}
              // groupSelector={(id, field) => }
            />
            <Toolbar type={type} chartId={chartId} onRemove={onRemove} />
          </>
        )}
      </div>
    </ChartContainer>
  );
}
