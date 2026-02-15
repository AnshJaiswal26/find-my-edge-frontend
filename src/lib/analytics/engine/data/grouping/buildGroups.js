import { compileGroupSpec } from "./compileGroupSpec";

export function buildGroups({
  tradeOrder,
  tradesById,
  groupSpec,
  getValue,
  getFormat,
}) {
  if (!groupSpec) return null;

  const getKey = compileGroupSpec(groupSpec, getValue, getFormat);
  const format = getFormat(groupSpec.key);
  const map = new Map();

  for (const tradeId of tradeOrder) {
    const trade = tradesById[tradeId];
    const label = getKey(trade, format) ?? "Empty";

    if (!map.has(label)) {
      map.set(label, {
        groupId: label,
        label,
        value: getValue(trade, groupSpec.key),
        tradeIds: [],
      });
    }

    map.get(label).tradeIds.push(tradeId);
  }

  // 🔥 SORT GROUPS (KEY STEP)
  return Array.from(map.values()).sort((a, b) => {
    // handle numeric groups (like dates, PnL ranges, etc.)
    const aNum = parseFloat(a.value);
    const bNum = parseFloat(b.value);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }

    // fallback string sort
    return String(a.label).localeCompare(String(b.label));
  });
}
