import { useRiskManagementStore } from "@features/risk-management/stores";
import { calculateCharges, safe } from "@features/risk-management/utils";

export default function useTradeSummary() {
  const transaction = useRiskManagementStore((s) => s.currentTransaction);
  const buyPrice = useRiskManagementStore((s) => s[transaction].buyPrice);
  const sellPrice = useRiskManagementStore((s) => s[transaction].sellPrice);
  const qty = useRiskManagementStore((s) => s[transaction].qty);

  const buyVal = buyPrice * qty;
  const sellVal = sellPrice * qty;
  const tradeVal = buyVal + sellVal;

  const calc = (field) =>
    calculateCharges(field, qty, buyVal, sellVal, tradeVal);
  const totalCharges = calc("totalCharges");
  const netPL = sellVal - buyVal - totalCharges;
  const netPLPercent = (netPL / buyVal) * 100;
  const grossPL = sellVal - buyVal;
  const breakevenPts = totalCharges / qty;

  const pnlColor = netPL === 0 ? "neutral" : netPL > 0 ? "green" : "red";

  // ⚡ Pre-built lists for direct rendering
  const transactionSummaryList = [
    { label: "Trade Value", value: tradeVal },
    { label: "Buy Value", value: buyVal },
    { label: "Sell Value", value: sellVal },
    { label: "Brokerage", value: calc("brokerage") },
    { label: "Other Charges", value: calc("otherCharges") },
    { label: "Total Charges", value: totalCharges },
    { label: "Gross P&L", value: grossPL, style: pnlColor },
    { label: "Net P&L", value: netPL, style: pnlColor },
    {
      label: "Net P&L (%)",
      value: safe(netPLPercent, 2),
      suffix: "%",
      style: pnlColor,
    },
  ];

  const chargesSummaryList = [
    { label: "Turnover", value: Math.ceil(tradeVal) },
    { label: "Brokerage", value: calc("brokerage") },
    {
      label: "Exchange Transaction Charges",
      value: calc("exchangeTransactionCharges"),
    },
    { label: "DP Charges", value: calc("dpCharges") },
    { label: "Securities Transaction Tax STT", value: calc("stt") },
    { label: "SEBI Turnover Charges", value: calc("sebiCharges") },
    { label: "Investor Protection Fund Trust IPFT", value: calc("ipft") },
    { label: "Stamp Duty", value: calc("stampDuty") },
    { label: "GST", value: calc("gst") },
    { label: "Total Tax & Charges", value: totalCharges },
    {
      label: "Points to Breakeven (No Profit No Loss)",
      value: safe(breakevenPts, 2),
      prefix: "+",
    },
  ];

  return {
    transactionName: transaction,

    // Values if someone else needs them
    values: {
      buyVal,
      sellVal,
      tradeVal,
      grossPL,
      netPL,
      netPLPercent,
      breakevenPts,
    },

    // Lists for components
    transactionSummaryList,
    chargesSummaryList,
  };
}
