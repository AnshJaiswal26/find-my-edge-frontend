import { useMemo } from "react";
import { useTradeStore } from "@shared/stores";
import { formatDate } from "@shared/utils";

export const useCalendarTrades = (year, month) => {
  const tradesById = useTradeStore((s) => s.tradesById);
  const derivedByTradeId = useTradeStore((s) => s.derivedByTradeId);
  const tradesOrder = useTradeStore((s) => s.tradesOrder);

  return useMemo(() => {
    const daily = {};

    tradesOrder.forEach((id) => {
      const trade = { ...tradesById[id], ...(derivedByTradeId[id] || {}) };
      if (!trade?.date) return;

      const date = formatDate(trade.date, "YYYY-MM-DD");
      const d = new Date(date);
      if (d.getFullYear() !== year || d.getMonth() !== month) return;

      const pnl = Number(trade.pnl || 0);

      if (!daily[date]) {
        daily[date] = {
          amount: 0,
          trades: [],
        };
      }

      daily[date].amount += pnl;
      daily[date].trades.push(trade); // store full trade object
    });

    return Object.entries(daily).map(([date, info]) => ({
      date,
      amount: info.amount,
      trades: info.trades,
      type: info.amount > 0 ? "profit" : info.amount < 0 ? "loss" : "no-trade",
    }));
  }, [tradesById, tradesOrder, year, month]);
};
