export function collectAffectedSchemas(startColId, affectedMap) {
  const visited = new Set();
  const ordered = [];

  function dfs(colId) {
    const next = affectedMap[colId] || [];

    for (const dep of next) {
      if (visited.has(dep)) continue;

      visited.add(dep);
      ordered.push(dep);
      dfs(dep);
    }
  }

  dfs(startColId);
  return ordered;
}
