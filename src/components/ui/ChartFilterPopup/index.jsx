import { useMemo, useRef, useState } from "react";
import { IconButton } from "../Buttons";
import { Filter } from "lucide-react";
import { useClickOutside } from "@hooks";
import { ChartPopup } from "@layout";
import { useChartStore } from "@stores";
import { filterOptions, sortOptions } from "@utils";
import ExpandableSection from "./ExpandableSection";
import styles from "./ChartFilterPopup.module.css";
import { handleApply } from "./handlers";

export default function ChartFilterPopup({ chartId }) {
  const [showFilter, setShowFilter] = useState(false);
  const ref = useRef();
  useClickOutside(ref, () => setShowFilter(false));

  const updateSeries = useChartStore((s) => s.updateSeries);

  const resetSeries = useChartStore((s) => s.resetSeries);

  const updateFilters = useChartStore((s) => s.updateFilters);

  const filters = useChartStore((s) => s.charts[chartId].filters);

  const { selectedSort, selectedFilter, value, from, to, filterKey } = filters;

  const sections = useMemo(
    () => [
      {
        onSelect: (v) => updateFilters(chartId, { selectedSort: v }),
        selected: selectedSort,
        title: "Sort In Order",
        list: sortOptions,
      },
      {
        onSelect: (v) => updateFilters(chartId, { selectedFilter: v }),
        selected: selectedFilter,
        title: "Filter By Condition",
        list: filterOptions,
      },
    ],
    [selectedSort, selectedFilter]
  );

  return (
    <div ref={ref} className="relative">
      <IconButton
        className={"rounded-none"}
        icon={<Filter size={15} />}
        tooltip={{ title: "Filter", position: "bottom" }}
        onClick={() => setShowFilter((p) => !p)}
      />

      <ChartPopup
        title={"Filter"}
        isVisible={showFilter}
        onLeftBtnClick={() => {
          resetSeries(chartId);
          setShowFilter(false);
          updateFilters(chartId, "reset");
        }}
        onRightBtnClick={() =>
          handleApply(chartId, filters, updateSeries, setShowFilter)
        }
        className={styles.filterPopupContent}
      >
        <SeriesSelector
          chartId={chartId}
          updateFilters={updateFilters}
          filterKey={filterKey}
        />
        {sections.map((item, i) => (
          <ExpandableSection
            key={i}
            onSelect={item.onSelect}
            title={item.title}
            selected={item.selected}
            options={item.list}
            values={{ value, from, to }}
            onChange={(k, v) => updateFilters(chartId, { [k]: v })}
          />
        ))}
      </ChartPopup>
    </div>
  );
}

function SeriesSelector({ chartId, updateFilters, filterKey }) {
  const seriesConfig = useChartStore((s) => s.charts[chartId].seriesConfig);

  return (
    <ExpandableSection
      onSelect={(v) => updateFilters(chartId, { filterKey: v })}
      title={"Series"}
      selected={filterKey}
      options={seriesConfig.map((cfg) => cfg.key)}
    />
  );
}
