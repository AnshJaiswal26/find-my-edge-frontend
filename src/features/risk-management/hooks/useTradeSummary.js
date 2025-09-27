import { useRiskManagementStore } from "@features/risk-management/stores";
import { calculateCharges } from "@features/risk-management/utils";

export default function useTradeSummary() {
  const transaction = useRiskManagementStore((s) => s.currentTransaction);

  const buyPrice = useRiskManagementStore((s) => s[transaction].buyPrice);
  const sellPrice = useRiskManagementStore((s) => s[transaction].sellPrice);
  const qty = useRiskManagementStore((s) => s[transaction].qty);

  const buyVal = buyPrice * qty;
  const sellVal = sellPrice * qty;
  const tradeVal = buyVal + sellVal;

  const calculate = (field) =>
    calculateCharges(field, qty, buyVal, sellVal, tradeVal);

  const totalCharges = calculate("totalCharges");
  const netPL = sellVal - buyVal - totalCharges;
  const netPLPercent = (netPL / buyVal) * 100;

  return {
    transactionName: transaction,
    tradeVal,
    buyVal,
    sellVal,
    grossPL: sellVal - buyVal,
    netPL,
    netPLPercent,
    breakevenPts: totalCharges / qty,
    colorForPnl: netPL === 0 ? "neutral" : netPL > 0 ? "green" : "red",
    charges: {
      brokerage: calculate("brokerage"),
      eT: calculate("exchangeTransactionCharges"),
      dp: calculate("dpCharges"),
      stt: calculate("stt"),
      sebi: calculate("sebiCharges"),
      ipft: calculate("ipft"),
      stampDuty: calculate("stampDuty"),
      gst: calculate("gst"),
      others: calculate("otherCharges"),
      total: totalCharges,
    },
  };
}
