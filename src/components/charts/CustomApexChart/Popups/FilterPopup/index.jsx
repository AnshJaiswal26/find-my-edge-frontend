import { useMemo, useRef, useState } from "react";
import { IconButton } from "../../../../ui/Buttons";
import { Filter } from "lucide-react";
import { useClickOutside } from "@hooks";
import { ChartPopup } from "@layout";
import { useChartStore } from "@stores";
import { filterOptions, sortOptions } from "@utils";
import ExpandableSection from "./ExpandableSection";
import styles from "./ChartFilterPopup.module.css";
import { handleApply } from "./handlers";

export default function FilterPopup({ chartId }) {
  const [showFilter, setShowFilter] = useState(false);
  const ref = useRef();

  useClickOutside(ref, () => {
    setShowFilter(false);
  });

  const updateChart = useChartStore((s) => s.updateChart);

  const filters = useChartStore((s) => s.charts[chartId].filters);

  const { selectedSort, selectedFilter, value, from, to, selectedSeries } =
    filters;

  const sections = useMemo(
    () => [
      {
        onSelect: (v) =>
          updateChart(chartId, (chart) => {
            chart.filters.selectedSort = v;
          }),
        selected: selectedSort,
        title: "Sort In Order",
        list: sortOptions,
      },
      {
        onSelect: (v) =>
          updateChart(chartId, (chart) => {
            chart.filters.selectedFilter = v;
          }),
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
        icon={<Filter />}
        tooltip={{ title: "Filter", position: "bottom" }}
        onClick={() => setShowFilter((p) => !p)}
        className={"icon-button"}
      />

      <ChartPopup
        title={"Filter"}
        isVisible={showFilter}
        onLeftBtnClick={() => {
          updateChart(chartId, (chart) => {
            chart.filteredSeries = chart.originalSeries;
            chart.filters = {
              ...chart.filters,
              selectedFilter: "none",
              selectedSort: "none",
              value: "",
              from: "",
              to: "",
            };
          });
          setShowFilter(false);
        }}
        onRightBtnClick={() => {
          updateChart(chartId, handleApply);
          setShowFilter(false);
        }}
        className={styles.filterPopupContent}
      >
        <SeriesSelector
          chartId={chartId}
          updateChart={updateChart}
          selectedSeries={selectedSeries}
        />
        {sections.map((item, i) => (
          <ExpandableSection
            key={i}
            onSelect={item.onSelect}
            title={item.title}
            selected={item.selected}
            options={item.list}
            values={{ value, from, to }}
            onChange={(k, v) =>
              updateChart(chartId, (chart) => {
                chart.filters[k] = v;
              })
            }
          />
        ))}
      </ChartPopup>
    </div>
  );
}

function SeriesSelector({ chartId, updateChart, selectedSeries }) {
  const series = useChartStore((s) => s.charts[chartId].series);

  return (
    <ExpandableSection
      onSelect={(v) =>
        updateChart(chartId, (chart) => {
          chart.filters.selectedSeries = v;
        })
      }
      title={"Series"}
      selected={selectedSeries}
      options={series}
    />
  );
}
