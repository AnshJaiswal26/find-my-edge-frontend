export function getAllDependencies(schemaId, schemasById, visited = new Set()) {
  if (visited.has(schemaId)) return [];
  visited.add(schemaId);

  const schema = schemasById[schemaId];
  if (!schema || !schema.dependencies?.length) return [];

  const deps = [];

  for (const dep of schema.dependencies) {
    deps.push(dep);
    deps.push(...getAllDependencies(dep, schemasById, visited));
  }

  return deps;
}
