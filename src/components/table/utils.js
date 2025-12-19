// utils/tableUtils.ts

export const TONE_CLASS = {
  profit: "text-(--success) bg-(--success-soft)",
  loss: "text-(--error) bg-(--error-soft)",
  neutral: "bg-(--surface)",
  muted: "bg-(--surface)",
};

export function formatValue(value, column) {
  if (value == null) return "—";

  if (column.display?.format === "currency") {
    return `₹${value.toFixed(column.display.decimals ?? 0)}`;
  }

  if (column.display?.format === "percent") {
    return `${value.toFixed(column.display.decimals ?? 0)}%`;
  }

  if (column.display?.format === "ratio") {
    return `1:${value.toFixed(column.display.decimals ?? 0)}`;
  }

  return String(value);
}

// utils/array.ts
export function moveItem(arr, from, to) {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}
