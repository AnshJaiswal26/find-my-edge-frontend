import { Select } from "@shared/components/ui";
import { formatGroupValue } from "@shared/utils";

import { chartEngine } from "@modules/charts/apex/model/chartEngine";
import { useChartStore } from "@modules/charts/apex/store";
import { useChartEngineEvent } from "@modules/charts/apex/hooks";
import { useMemo, useState } from "react";

export const GroupOptionSelect = ({
  chartId,
  getDisplayValue,
  getSemanticType,
}) => {
  const [, setReady] = useState(false);

  useChartEngineEvent("chart:init", (id) => {
    if (chartId === id) {
      setReady(true);
    }
  });

  const format = useChartStore((s) => s.charts[chartId].layout.xFormat);
  const decimals = useChartStore((s) => s.charts[chartId].layout.xDecimals);
  const groupSpecField = useChartStore(
    (s) => s.charts[chartId].groupSpec?.field,
  );
  const isKeySame = useChartStore(
    (s) => s.charts[chartId].xMetric.field === groupSpecField,
  );

  const { groups, currentGroupIndex } = useMemo(
    () => chartEngine.getGroups(chartId),
    [],
  );

  const [currentIndex, setCurrentIndex] = useState(currentGroupIndex);

  if (!groups.length) return null;

  return (
    <Select
      classNames={{ button: "py-1.5!" }}
      options={groups}
      value={groups[currentIndex]}
      getLabel={(g) => {
        const display = isKeySame
          ? { format, decimals }
          : getDisplayValue(groupSpecField);

        return formatGroupValue(
          g.meta,
          getSemanticType(groupSpecField),
          display,
        );
      }}
      onChange={(_, i) => {
        chartEngine.showGroup(chartId, i);
        setCurrentIndex(i);
      }}
    />
  );
};
