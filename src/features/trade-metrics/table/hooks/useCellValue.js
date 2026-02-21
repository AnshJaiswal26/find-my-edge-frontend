import { useTradeStore } from "@shared/stores";

export const useCellValue = (rowId, colId) =>
  useTradeStore((s) => {
    const derived = s.derivedByTradeId[rowId];
    const raw = s.tradesById[rowId];
    return derived?.[colId] ?? raw?.[colId] ?? null;
  });
