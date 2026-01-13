function getAllDependencies(columnId, columnsById, visited = new Set()) {
  if (visited.has(columnId)) return [];
  visited.add(columnId);

  const column = columnsById[columnId];
  if (!column || !column.dependencies?.length) return [];

  const deps = [];

  for (const dep of column.dependencies) {
    deps.push(dep);
    deps.push(...getAllDependencies(dep, columnsById, visited));
  }

  return deps;
}

export function getLockedColumns(state) {
  const locked = new Set();
  const { columnsById, sort, filters, filteredRowOrder, groupBy } = state;

  // 1️⃣ Collect active “view-defining” columns
  const activeColumns = new Set();

  if (sort?.columnId) activeColumns.add(sort.columnId);
  if (groupBy?.key) activeColumns.add(groupBy.key);

  if (filteredRowOrder?.length) {
    for (const f of filters) {
      activeColumns.add(f.columnId);
    }
  }

  // 2️⃣ Lock active columns + their dependencies
  for (const colId of activeColumns) {
    locked.add(colId);

    const deps = getAllDependencies(colId, columnsById);
    for (const dep of deps) {
      locked.add(dep);
    }
  }

  return locked;
}

export function isColumnEditable(columnId, state) {
  const column = state.columnsById[columnId];
  if (!column?.editable) return false;

  const lockedColumns = getLockedColumns(state);
  return !lockedColumns.has(columnId);
}
