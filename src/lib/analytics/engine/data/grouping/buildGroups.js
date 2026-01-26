import { compileGroupSpec } from "./compileGroupSpec";

export function buildGroups({ tradeOrder, tradesById, groupSpec, getValue }) {
  if (!groupSpec) return null;

  const getKey = compileGroupSpec(groupSpec, getValue);
  const map = new Map();

  for (const tradeId of tradeOrder) {
    const trade = tradesById[tradeId];
    const label = getKey(trade) ?? "Empty";

    if (!map.has(label)) {
      map.set(label, { groupId: label, label, tradeIds: [] });
    }

    map.get(label).tradeIds.push(tradeId);
  }

  return Array.from(map.values());
}
