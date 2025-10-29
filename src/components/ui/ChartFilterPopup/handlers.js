import { useChartStore } from "@stores";
import { filterOperationMap, sortOperationMap } from "@utils";

export const handleApply = (chartId, filters, updateChart, setShowFilter) => {
  const { selectedSeries, selectedFilter, selectedSort, value, from, to } =
    filters;
  let filtered = [...useChartStore.getState().charts[chartId].originalSeries];

  const sortFn = sortOperationMap?.[selectedSort];
  const filterFn = filterOperationMap?.[selectedFilter];

  if (selectedFilter && selectedFilter !== "none") {
    if (selectedFilter === "isBetween" || selectedFilter === "isNotBetween") {
      filtered = filtered.filter((s) => filterFn(s[selectedSeries], from, to));
    } else
      filtered = filtered.filter((s) => filterFn(s[selectedSeries], value));
  }

  if (selectedSort && selectedSort !== "none") {
    filtered = filtered.sort((a, b) =>
      sortFn(a[selectedSeries], b[selectedSeries])
    );
  }

  updateChart(chartId, { filteredSeries: filtered });
  setShowFilter(false);
};
