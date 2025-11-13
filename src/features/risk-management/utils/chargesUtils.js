import { safe } from "./formatterUtils";

export const calculateCharges = (field, qty, buyVal, sellVal, tradeVal) => {
  if ((buyVal === 0 && sellVal === 0) || qty === 0) return 0;
  const brokerage = sellVal === 0 ? 20 : 40;
  switch (field) {
    case "brokerage":
      return brokerage;
    case "exchangeTransactionCharges":
      return 0.0003503 * tradeVal;
    case "dpCharges":
      return 0;
    case "stt":
      return 0.001 * sellVal;
    case "sebiCharges":
      return 0.000001 * tradeVal;
    case "ipft":
      return 0.000005 * tradeVal;
    case "stampDuty":
      return 0.00003 * buyVal;
    case "gst": {
      const exchTxnCharges = 0.0003503 * tradeVal;
      return 0.18023 * (brokerage + exchTxnCharges);
    }
    case "otherCharges": {
      const charges = {
        exchTxn: 0.0003503 * tradeVal,
        dp: 0,
        stt: 0.001 * sellVal,
        sebi: 0.000001 * tradeVal,
        ipft: 0.000005 * tradeVal,
        stamp: 0.00003 * buyVal,
        gst: 0.18 * (brokerage + 0.0003503 * tradeVal),
      };
      return Object.values(charges).reduce((sum, charge) => sum + charge);
    }
    case "totalCharges": {
      const others = calculateCharges(
        "otherCharges",
        qty,
        buyVal,
        sellVal,
        tradeVal
      );
      return brokerage + others;
    }
    default:
      return 0;
  }
};

export const getNewCharges = (section, currentCharges) => {
  const { buyPrice, sellPrice, qty } = section;
  const pts = currentCharges / qty;
  const newSellPrice = sellPrice + pts;
  const buyValue = buyPrice * qty;
  const sellValue = newSellPrice * qty;
  const tradeValue = buyValue + sellValue;

  return calculateCharges("totalCharges", qty, buyValue, sellValue, tradeValue);
};

export const toggleCharges = (section, field, capital) => {
  const { name, sellPrice, qty, pts, amount, percent } = section;

  if (qty === 0) return [];

  const isAdd = field === "added";

  const baseCharges = getNewCharges(section, 0);
  const adjustCharges = isAdd
    ? getNewCharges(section, baseCharges)
    : baseCharges;
  const newCharges = safe(isAdd ? adjustCharges : -adjustCharges);

  const changeInPts = safe(newCharges / qty);
  const changeInPercent = safe(newCharges / capital) * 100;

  const updated = {
    sellPrice: sellPrice + changeInPts,
    pts: pts + changeInPts,
    amount: amount + newCharges,
    percent: capital !== 0 ? percent + changeInPercent : 0,
  };

  return ["calculator", name, updated];
};
