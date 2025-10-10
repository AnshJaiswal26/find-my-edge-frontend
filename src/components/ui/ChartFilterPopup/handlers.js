import { useChartStore } from "@stores";
import { filterOperationMap, sortOperationMap } from "@utils";

export const handleApply = (chartId, filters, updateSeries, setShowFilter) => {
  const { filterKey, selectedFilter, selectedSort, value, from, to } = filters;
  let filtered = [...useChartStore.getState().charts[chartId].originalSeries];

  const sortFn = sortOperationMap?.[selectedSort];
  const filterFn = filterOperationMap?.[selectedFilter];

  if (selectedFilter && selectedFilter !== "none") {
    if (selectedFilter === "isBetween" || selectedFilter === "isNotBetween") {
      filtered = filtered.filter((s) => filterFn(s[filterKey], from, to));
    } else filtered = filtered.filter((s) => filterFn(s[filterKey], value));
  }

  if (selectedSort && selectedSort !== "none") {
    filtered = filtered.sort((a, b) => sortFn(a[filterKey], b[filterKey]));
  }

  updateSeries(chartId, filtered);
  setShowFilter(false);
};
