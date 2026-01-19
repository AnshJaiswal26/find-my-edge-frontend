import { useMemo, useRef, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@ui";
import { ChartPopup } from "@layout";
import { useChartStore } from "@charts/apex/store/useChartStore";
import { filterOptions, sortOptions } from "@utils";
import ExpandableSection from "./ExpandableSection";
import styles from "./FilterPopup.module.css";
import { handleApply } from "./handlers";

export default function FilterPopup({ chartId }) {
  const [showFilter, setShowFilter] = useState(false);
  const ref = useRef();

  const updateChart = useChartStore((s) => s.updateChart);
  // const filters = useChartStore((s) => s[chartId].filters);
  const [filters, setFilters] = useState([]);

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
        list: Object.keys(sortOptions),
        label: (k) => sortOptions[k],
      },
      {
        onSelect: (v) =>
          updateChart(chartId, (chart) => {
            chart.filters.selectedFilter = v;
          }),
        selected: selectedFilter,
        title: "Filter By Condition",
        list: Object.keys(filterOptions),
        label: (k) => filterOptions[k],
      },
    ],
    [selectedSort, selectedFilter],
  );

  return (
    <div ref={ref} className="relative">
      <Button.Icon
        tooltip={{ text: "Filter", position: "left" }}
        onClick={() => setShowFilter((p) => !p)}
      >
        <Filter size={16} className="text-inherit" />
      </Button.Icon>

      <ChartPopup
        title={"Filter"}
        isVisible={showFilter}
        text={["Clear"]}
        onCancel={() => {
          updateChart(chartId, (chart) => {
            chart.series.filtered = chart.series.default;
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
        onApply={() => {
          updateChart(chartId, handleApply);
          setShowFilter(false);
        }}
        onClose={() => setShowFilter(false)}
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
            getLabel={item.label}
            values={{ value, from, to }}
            onChange={(k, v) =>
              updateChart(chartId, (chart) => {
                chart.filters[k] = v.toLowerCase();
              })
            }
          />
        ))}
      </ChartPopup>
    </div>
  );
}

function SeriesSelector({ chartId, updateChart, selectedSeries }) {
  const seriesConfig = useChartStore((s) => s[chartId].seriesConfig);

  return (
    <ExpandableSection
      onSelect={(v) =>
        updateChart(chartId, (chart) => {
          chart.filters.selectedSeries = v;
        })
      }
      title={"Series"}
      selected={selectedSeries}
      options={seriesConfig.map((s) => s.key)}
    />
  );
}
