export function buildAffectedMap(columnsById) {
  const affected = {};

  Object.values(columnsById).forEach((col) => {
    col.dependencies?.forEach((dep) => {
      if (!affected[dep]) affected[dep] = [];
      affected[dep].push(col.id);
    });
  });

  return affected;
}
