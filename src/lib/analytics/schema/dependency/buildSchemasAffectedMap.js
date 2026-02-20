export function buildSchemasAffectedMap(schemasById, schemasOrder) {
  const affected = {};

  schemasOrder.forEach((id) => {
    const schema = schemasById[id];

    schema.dependencies?.forEach((dep) => {
      if (!affected[dep]) affected[dep] = [];
      affected[dep].push(schema.id);
    });
  });

  return affected;
}
