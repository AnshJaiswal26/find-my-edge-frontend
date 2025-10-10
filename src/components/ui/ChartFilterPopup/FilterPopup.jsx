import { useMemo } from "react";
import { filterOptions, sortOptions } from "@utils";
import styles from "./ChartFilterPopup.module.css";
import ExpandableSection from "./ExpandableSection";
import Footer from "./Footer";
import { useChartStore } from "@stores";
import { handleApply } from "./handlers";

export default function FilterPopup({ chartId, setShowFilter }) {
  const updateSeries = useChartStore((s) => s.updateSeries);
  const updateFilters = useChartStore((s) => s.updateFilters);
  const filters = useChartStore((s) => s.filters[chartId]);

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
    <div className={styles.filterContainer}>
      <header>
        <span>Filters</span>
      </header>

      <main className="flex-box flex-col gap-2 items-start text-[0.78rem]">
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
      </main>

      <Footer
        onClear={() => {
          updateSeries(chartId, "reset");
          setShowFilter(false);
          updateFilters(chartId, {
            value: "",
            from: "",
            to: "",
            selectedSort: "none",
            selectedFilter: "none",
          });
        }}
        onApply={() =>
          handleApply(chartId, filters, updateSeries, setShowFilter)
        }
      />
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
