import { useMemo } from "react";
import { useTradeStore } from "@stores";
import { formatDate } from "@utils";

export const useCalendarTrades = (year, month) => {
  const tradesById = useTradeStore((s) => s.tradesById);
  const tradeOrder = useTradeStore((s) => s.tradeOrder);

  return useMemo(() => {
    const daily = {};

    tradeOrder.forEach((id) => {
      const trade = tradesById[id];
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
  }, [tradesById, tradeOrder, year, month]);
};
