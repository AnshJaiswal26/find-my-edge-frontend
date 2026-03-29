import {
  cleanFloat,
  formatValue,
  generateTooltip,
  getValBySecName,
  resolvePts,
  safe,
} from "@features/risk-management/utils";

const checkValues = (field, val) => {
  let Max_Val = 100 * 10000000,
    isValid;
  if (field === "pts" || field === "percent") isValid = val <= 10000;
  else if (field === "amount" || field === "capital") isValid = val <= Max_Val;
  else if (field === "ratio") isValid = val <= 100;
  else val <= 100000;
};

// --- field specfic handler mappings ---
const fieldHandlers = {
  current: handleCapitalChange,
  ratio: handleRiskRewardChange,
  buyPrice: handlePriceChange,
  sellPrice: handlePriceChange,
  qty: handleQtyChange,
  pts: handlePtsAmountAndPercentChange,
  amount: handlePtsAmountAndPercentChange,
  percent: handlePtsAmountAndPercentChange,
  lotSize: handlePositionSizingChange,
  slPts: handlePositionSizingChange,
  riskAmount: handlePositionSizingChange,
  riskPercent: handlePositionSizingChange,
};

// --- main handler for all inputs ---
export function handleChange(sectionName, field, value, state) {
  const updateSections = state.updater.sections;
  const showTooltip = state.updater.tooltip;

  const capital = state.capital.current;
  const section = state[sectionName];

  // const { status, caseValue } = checkSpecialCase(sectionName, field, value);

  // if (caseValue !== null) {
  //   state.updater.section(
  //     sectionName,
  //     { [field]: caseValue },
  //     { round: false }
  //   );
  //   return;
  // } else if (status) return;

  const prev = section[field];
  const num = Number(value);

  if (prev === num) return;

  if ((capital === 0 && field === "percent") || field === "riskPercent") {
    showTooltip("capitalTooltip", {
      current: generateTooltip(field, "zeroCapital"),
    });
    return;
  }

  const updates = fieldHandlers[field]({ section, field, val: num, state });

  if (updates) {
    updates.push(["single-value", "inputPrev", num]);
    updateSections(updates);
  }
}

// --- check for valid/invalid special cases ---
export function checkSpecialCase(name, field, val, inputPrev) {
  const isOnlyDash = val === "-";
  const hasTrailingDot = /^-?\d+\.$/.test(val);
  const hasTrailingZeros = /\d+\.(?:0+)$/.test(val);
  const isNegSignWithDotOrZero = val.startsWith("-.") || val.startsWith("0-");
  const isValidNumeric = /^-?\d*\.?\d*$/.test(val);
  const isNegField =
    name === "calculator" && ["pts", "amount", "percent"].includes(field);

  if (hasTrailingDot || hasTrailingZeros || isOnlyDash)
    return { status: true, caseValue: inputPrev ?? val };

  if (isNegField && isNegSignWithDotOrZero)
    return { status: true, caseValue: "-" };

  if (!isValidNumeric) return { status: true, caseValue: null };

  return { status: false, caseValue: null };
}

// --- handle trading capital change ---
function handleCapitalChange({ val, state }) {
  const { calculator, target, stopLoss, positionSizing } = state;
  const newCapital = Math.max(0, val);

  const calcPer = safe((calculator.amount / newCapital) * 100);
  const targetPer = safe((target.amount / newCapital) * 100);
  const sLPer = safe((stopLoss.amount / newCapital) * 100);
  const riskPercent = safe((positionSizing.riskAmount / newCapital) * 100);

  return [
    ["calculator", "capital", { current: newCapital }],
    ["calculator", "calculator", { percent: calcPer }],
    ["calculator", "target", { percent: targetPer }],
    ["calculator", "stopLoss", { percent: sLPer }],
    ["calculator", "positionSizing", { percent: riskPercent }],
  ];
}

// --- handle risk reward change ---
function handleRiskRewardChange({ val, state }) {
  const { buyPrice, pts, qty } = state.stopLoss;
  const newRiskReward = Math.max(0, val);

  const syncUpdates = validateAndSyncSection(
    {
      name: "stopLoss",
      field: "pts",
      buyPrice,
      pts,
      qty,
      rr: newRiskReward,
      state,
    },
    false,
  );

  return [
    ["calculator", "riskReward", { ratio: newRiskReward }],
    ...syncUpdates,
  ];
}

// --- handle buy and sell price change ---
function handlePriceChange({ section, field, val, state }) {
  const { name, buyPrice, sellPrice, qty, pts } = section;
  const isBuyPrice = field === "buyPrice";
  const price = Math.max(0, val);

  const capital = state.capital.current;
  const input = state.settings.derivedInput;
  const isAmountLock = input === "amount";
  const isBLockAndSPrice = input === "buyPrice" && !isBuyPrice;
  const isSLockAndBPrice = input === "sellPrice" && isBuyPrice;

  const updated = { [field]: price };
  isBLockAndSPrice && (updated.buyPrice = price - pts);
  isSLockAndBPrice && (updated.sellPrice = price + pts);

  const shouldCompute = input === field || isAmountLock;
  if (shouldCompute) {
    const diff = isBuyPrice ? sellPrice - price : price - buyPrice;
    updated.pts = resolvePts(name, pts, diff);
    updated.amount = safe(updated.pts * qty);
    updated.percent = safe((updated.amount / capital) * 100);
  }

  const syncUpdates = validateAndSyncSection({
    name,
    field,
    buyPrice: updated.buyPrice ?? buyPrice,
    sellPrice: updated.sellPrice ?? sellPrice,
    pts,
    qty,
    state,
  });

  return [["calculator", name, updated], ...syncUpdates];
}

// --- handle trade quantity change ---
function handleQtyChange({ section, field, val, state }) {
  const { name, buyPrice, sellPrice, pts, amount } = section;
  const newQty = Math.abs(parseInt(val));

  const capital = state.capital.current;
  const derivedInput = state.settings.derivedInput;
  const isAmountLock = derivedInput === "amount";
  const isBuyLock = derivedInput === "buyPrice";

  const updated = { qty: newQty };

  if (isAmountLock) {
    updated.amount = pts * newQty;
    updated.percent = safe(updated.amount / capital) * 100;
  } else {
    updated.pts = safe(amount / newQty);
    if (isBuyLock) updated.buyPrice = sellPrice - updated.pts;
    else updated.sellPrice = buyPrice + updated.pts;
  }

  const syncUpdates = validateAndSyncSection({
    name,
    field,
    buyPrice: updated.buyPrice ?? buyPrice,
    sellPrice: updated.sellPrice ?? sellPrice,
    pts,
    qty: newQty,
    state,
  });

  return [["calculator", name, updated], ...syncUpdates];
}

// --- handle points, amount and percent change ---
export function handlePtsAmountAndPercentChange({
  section,
  field,
  val,
  state,
  isFormatting = false,
}) {
  const { name, buyPrice, sellPrice, qty } = section;
  const value = getValBySecName(name, val);

  const capital = state.capital.current;
  const { derivedInput, adjustedField } = state.settings;
  const isAmountLock = derivedInput === "amount";
  const isBuyLock =
    derivedInput === "buyPrice" ||
    (adjustedField === "buyPrice" && isAmountLock);

  const isPts = field === "pts";

  const newAmount = isPts
    ? value * qty
    : field === "amount"
      ? value
      : capital * safe(value / 100);
  const newPts = isPts ? value : safe(newAmount / qty);
  const newPercent = safe(newAmount / capital) * 100;

  const newBuyPrice = isBuyLock ? sellPrice - newPts : buyPrice;
  const newSellPrice = !isBuyLock ? buyPrice + newPts : sellPrice;

  const syncUpdates = !isFormatting
    ? validateAndSyncSection({
        name,
        field,
        buyPrice: newBuyPrice,
        sellPrice: newSellPrice,
        pts: newPts,
        qty,
        state,
      })
    : [];

  return [
    [
      "calculator",
      name,
      {
        buyPrice: newBuyPrice,
        sellPrice: newSellPrice,
        pts: newPts,
        amount: newAmount,
        percent: newPercent,
      },
    ],
    ...syncUpdates,
  ];
}

// --- handle position sizing inputs change ---
function handlePositionSizingChange({ section, field, val, state }) {
  const calculateLockFields = (amt, slPts, lotSize, mode) => {
    const suggestedQty = Math[mode](safe(amt / slPts / lotSize)) * lotSize;
    const adjustedSl = safe(amt / suggestedQty);
    return {
      suggestedQty: suggestedQty,
      adjustedSl: formatValue(adjustedSl, {
        mode: "Market",
        direction: "floor",
      }),
    };
  };

  const { name, lotSize, slPts, riskAmount } = section;
  const capital = state.capital.current;
  const roundQtyTo = state.settings.roundQtyTo;
  const mode =
    roundQtyTo === "Nearest" ? "round" : roundQtyTo === "Up" ? "ceil" : "floor";

  const num = Math.abs(val);

  const isAmt = field === "riskAmount";
  const opposite = isAmt ? "riskPercent" : "riskAmount";

  const updated = { [field]: num };

  if (isAmt || field === "riskPercent") {
    updated[opposite] = isAmt
      ? safe(num / capital) * 100
      : safe(num / 100) * capital;
  }

  const readOnlyFields = calculateLockFields(
    updated.riskAmount ?? riskAmount,
    updated.slPts ?? slPts,
    updated.lotSize ?? lotSize,
    mode,
  );

  return [["calculator", name, { ...updated, ...readOnlyFields }]];
}

// --- validate, sync target and stoploss ---
function validateAndSyncSection(current, validation = true) {
  const { name, field, buyPrice, sellPrice, pts, qty, rr, state } = current;

  const newBuyPrice = cleanFloat(buyPrice);

  if (validation) {
    const invalidsForCurrentSection = validateAndNotify({
      name,
      field,
      buyPrice: newBuyPrice,
      sellPrice: cleanFloat(sellPrice),
      state,
    });

    if (invalidsForCurrentSection.length !== 0 || name === "calculator")
      return [invalidsForCurrentSection];
  }

  const ratio = rr ?? state.riskReward.ratio;
  const capital = state.capital.current;

  const isTarget = name === "target";
  const oppoSec = isTarget ? "stopLoss" : "target";

  const amt = Math.abs(pts);
  const newPts = isTarget ? safe(-amt / ratio) : amt * ratio;

  const sync = {
    pts: newPts,
    buyPrice,
    sellPrice: buyPrice + newPts,
    qty,
    amount: newPts * qty,
    percent: safe((newPts * qty) / capital) * 100,
  };

  const invalidsForOppositeSection = validateAndNotify({
    name: oppoSec,
    field,
    buyPrice: newBuyPrice,
    sellPrice: cleanFloat(sync.sellPrice),
    state,
  });

  return [["calculator", oppoSec, sync], invalidsForOppositeSection];
}

// --- validate and show tooltip if input is wrong ---
function validateAndNotify({ name, field, buyPrice, sellPrice, state }) {
  const prev = state[name + "Tooltip"];
  const isTargetOrSl = name === "target" || name === "stopLoss";
  const opposite = field === "buyPrice" ? "sellPrice" : "buyPrice";
  const isBuyPrice = field === "buyPrice";
  const updated = {};

  const isBuyNeg = buyPrice < 0;
  const isSellNeg = sellPrice < 0;
  const isBuyGreater = buyPrice > sellPrice && name === "target";
  const isBuySmaller = buyPrice < sellPrice && name === "stopLoss";

  const fields = [
    ["buyPrice", isBuyNeg],
    ["sellPrice", isSellNeg],
  ];

  for (const [f, isNeg] of fields) {
    const isPrevNull = prev?.[f] === null;

    if (isPrevNull && isNeg) {
      updated[f] = generateTooltip(f, "negative");
    } else if (!isPrevNull && !isNeg && prev[f].key.startsWith("n")) {
      updated[f] = null;
    }
  }
  if (isTargetOrSl && (field === "buyPrice" || field === "sellPrice")) {
    const label1 = isBuyPrice && isBuyGreater ? "less" : "greater";
    const label2 = isBuyPrice && isBuySmaller ? "greater" : "less";
    const key = name === "target" ? label1 : label2;
    const prevKey = prev[field]?.key;

    if (isBuyGreater || isBuySmaller) {
      if (prev[field] === null) {
        updated[field] = generateTooltip(field, key);
      }
    } else if (
      prevKey &&
      (prevKey.startsWith("l") || prevKey.startsWith("g"))
    ) {
      prev[field] !== null && (updated[field] = null);
      prev[opposite] !== null && (updated[opposite] = null);
    }
  }

  if (Object.keys(updated).length > 0) {
    return ["tooltip", `${name}Tooltip`, updated];
  }

  return [];
}
