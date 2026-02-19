import { getAllDependencies } from "@lib/analytics/schema/dependency";

export function getLockedColumnsMap(viewState, schemasById) {
  const locked = {};

  const { sort, filters, filteredRowOrder, groupBy } = viewState;

  const activeColumns = new Set();

  if (sort?.columnId) activeColumns.add(sort.columnId);
  if (groupBy?.key) activeColumns.add(groupBy.key);

  if (filteredRowOrder?.length) {
    for (const f of filters) {
      activeColumns.add(f.key);
    }
  }

  for (const colId of activeColumns) {
    locked[colId] = true;

    const deps = getAllDependencies(colId, schemasById);
    for (const dep of deps) {
      locked[dep] = true;
    }
  }

  return locked;
}
