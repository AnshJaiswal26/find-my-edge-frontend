import { useChartStore } from "@charts/apex/store/useChartStore";
import Toolbar from "../Toolbar";
import { ChartContainer } from "./ChartContainer";
import { ChartTitle } from "./ChartTitle";
import { ChartWithConfig } from "./ChartWithConfig";
import styles from "./CustomApexChart.module.css";
import { buildGroups } from "@lib/analytics/engine/data";
import { Select } from "@ui";
import { useMemo, useState } from "react";
import { formatGroupValue } from "@utils";

const GroupOptionSelect = ({
  chartId,
  groups,
  groupSpec,
  schemasById,
  category,
  selectedGroupIndex,
  setSelectedGroupIndex,
}) => {
  const format = useChartStore((s) => s[chartId].layout.xFormat);
  const decimals = useChartStore((s) => s[chartId].layout.xDecimals);

  if (!groups || groupSpec?.ast || category === "grouped") return null;

  return (
    <Select
      classNames={{ button: "py-1.5!" }}
      options={groups}
      value={groups[selectedGroupIndex]}
      getLabel={(g) => {
        return formatGroupValue(
          g.meta,
          schemasById[groupSpec.key].semanticType,
          {
            format,
            decimals,
          },
        );
      }}
      onChange={(_, i) => setSelectedGroupIndex(i)}
    />
  );
};

export default function CustomApexChart({
  chartId,
  type,
  category,
  seriesOrder,
  seriesById,
  schemasById,
  schemasOrder,
  onRemove,
}) {
  const groupSpec = useChartStore((s) => s[chartId]?.groupSpec);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  const groups = useMemo(() => {
    if (!groupSpec) return null;

    return buildGroups({
      tradeOrder: seriesOrder,
      tradesById: seriesById,
      groupSpec,
      getValue: (trade, key) => trade[key],
    });
  }, [seriesOrder, seriesById, groupSpec]);

  return (
    <ChartContainer chartId={chartId}>
      <div className="flex items-center justify-between">
        <ChartTitle chartId={chartId} />
        <GroupOptionSelect
          chartId={chartId}
          category={category}
          groups={groups}
          groupSpec={groupSpec}
          schemasById={schemasById}
          selectedGroupIndex={selectedGroupIndex}
          setSelectedGroupIndex={setSelectedGroupIndex}
        />
      </div>
      <div className={styles.chartWrapper}>
        <ChartWithConfig
          chartId={chartId}
          type={type}
          category={category}
          groups={groups}
          groupSpec={groupSpec}
          selectedGroupIndex={selectedGroupIndex}
          seriesOrder={seriesOrder}
          seriesById={seriesById}
          schemasById={schemasById}
          schemasOrder={schemasOrder}
        />
        <Toolbar
          type={type}
          chartId={chartId}
          seriesOrder={seriesOrder}
          seriesById={seriesById}
          schemasById={schemasById}
          schemasOrder={schemasOrder}
          onRemove={onRemove}
        />
      </div>
    </ChartContainer>
  );
}
