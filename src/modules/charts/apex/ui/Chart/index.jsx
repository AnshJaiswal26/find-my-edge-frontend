import { useChartStore } from "@modules/charts/apex/store";
import Toolbar from "../Toolbar";
import { ChartContainer } from "./ChartContainer";
import { ChartTitle } from "./ChartTitle";
import { ChartWithConfig } from "./ChartWithConfig";
import styles from "./CustomApexChart.module.css";
import { buildGroups } from "@lib/analytics/engine/data";
import { Loader, Select, Skeleton } from "@shared/components/ui";
import { useEffect, useMemo, useState } from "react";
import { formatGroupValue } from "@shared/utils";

const GroupOptionSelect = ({
  chartId,
  groups,
  groupSpec,
  schemasById,
  category,
  selectedGroupIndex,
  setSelectedGroupIndex,
}) => {
  const format = useChartStore((s) => s.charts[chartId].layout.xFormat);
  const decimals = useChartStore((s) => s.charts[chartId].layout.xDecimals);
  const isKeySame = useChartStore(
    (s) => s.charts[chartId].xSeriesConfig.key === groupSpec.key,
  );

  return (
    <Select
      classNames={{ button: "py-1.5!" }}
      options={groups}
      value={groups[selectedGroupIndex]}
      getLabel={(g) => {
        const display = isKeySame
          ? {
              format,
              decimals,
            }
          : schemasById[groupSpec.key].display;

        return formatGroupValue(
          g.meta,
          schemasById[groupSpec.key].semanticType,
          display,
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
  const groupSpec = useChartStore((s) => s.charts[chartId]?.groupSpec);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const groups = useMemo(() => {
    if (!groupSpec) return null;

    return buildGroups({
      tradesOrder: seriesOrder,
      tradesById: seriesById,
      groupSpec,
      getValue: (trade, key) => trade[key],
    });
  }, [seriesOrder, seriesById, groupSpec]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <ChartContainer chartId={chartId}>
      <div className="flex items-center justify-between">
        <ChartTitle chartId={chartId} />
        {groups && !groupSpec?.ast && category !== "grouped" && (
          <GroupOptionSelect
            chartId={chartId}
            category={category}
            groups={groups}
            groupSpec={groupSpec}
            schemasById={schemasById}
            selectedGroupIndex={selectedGroupIndex}
            setSelectedGroupIndex={setSelectedGroupIndex}
          />
        )}
      </div>

      <div className={styles.chartWrapper}>
        {!ready ? (
          <Loader className="!w-full !h-full" />
        ) : (
          <>
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
            />{" "}
            <Toolbar
              type={type}
              chartId={chartId}
              seriesOrder={seriesOrder}
              seriesById={seriesById}
              schemasById={schemasById}
              schemasOrder={schemasOrder}
              onRemove={onRemove}
            />
          </>
        )}
      </div>
    </ChartContainer>
  );
}
