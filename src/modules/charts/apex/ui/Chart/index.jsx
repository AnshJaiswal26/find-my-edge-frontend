import Toolbar from "../Toolbar";
import { ChartContainer } from "./ChartContainer";
import { ChartTitle } from "./ChartTitle";
import { ChartWithConfig } from "./ChartWithConfig";
import { Loader } from "@shared/components/ui";
import { useEffect, useState } from "react";

import { CHART_CATEGORY, CHART_MODE } from "@modules/charts/apex/model/enums";
import { GroupOptionSelect } from "./GroupOptionsSelect";

export default function CustomApexChart({
  chartId,
  type,
  category,
  mode,
  dataset,
  getDisplayValue,
  getSemanticType,
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <ChartContainer chartId={chartId}>
      <div className="flex items-center justify-between">
        <ChartTitle chartId={chartId} />
        {category !== CHART_CATEGORY.PARTITION &&
          mode === CHART_MODE.GROUP_SELECT && (
            <GroupOptionSelect
              chartId={chartId}
              getDisplayValue={getDisplayValue}
              getSemanticType={getSemanticType}
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
              dataset={dataset}
            />
            <Toolbar type={type} chartId={chartId} category={category} />
          </>
        )}
      </div>
    </ChartContainer>
  );
}
