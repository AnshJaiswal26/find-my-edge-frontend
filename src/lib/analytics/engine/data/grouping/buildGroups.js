import { compileGroupSpec } from "./compileGroupSpec";

function getGroupKey(value) {
  if (value == null) return "__EMPTY__";

  // primitives
  if (typeof value !== "object") {
    return String(value);
  }

  //  date bucket
  if (value.type === "DATE_BUCKET") {
    return `${value.unit}_${value.key}`;
  }

  //  time bucket
  if (value.type === "TIME_BUCKET") {
    return `${value.unit}_${value.value}`;
  }

  //  range
  if (value.type === "RANGE") {
    return `${value.from}_${value.to}`;
  }

  //  fallback
  return JSON.stringify(value);
}

export function buildGroups({ ids, groupSpec, getValue }) {
  if (!groupSpec) return null;

  const getKey = compileGroupSpec(groupSpec, getValue);
  const map = new Map();

  for (const id of ids) {
    const raw = getKey(id);
    const key = getGroupKey(raw);

    if (!map.has(key)) {
      map.set(key, {
        groupId: key,
        key,
        meta: raw,
        ids: [],
      });
    }

    map.get(key).ids.push(id);
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
    return String(a.key).localeCompare(String(b.key));
  });
}
