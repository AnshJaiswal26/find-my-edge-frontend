export const qtyRoundModePoints = {
  Nearest: [
    "Rounds quantity to the nearest valid lot multiple.",
    "✅ Balanced approach — adjusted SL may be slightly above or below original SL.",
    "⚖️ Best used when precision and capital efficiency are both important.",
  ],
  Up: [
    "Always rounds quantity upward to the next valid lot multiple.",
    "✅ Ensures full risk utilization — adjusted SL will always be 'lower' than original SL.",
    "⚠️ May slightly increase capital usage and reduce buffer margin.",
  ],
  Down: [
    "Always rounds quantity downward to the previous valid lot multiple.",
    "✅ Conservative sizing — adjusted SL will always be 'higher' than original SL.",
    "👍 Ideal for risk-sensitive setups or capital preservation strategies.",
  ],
};

export const calculationPoints = {
  Approx: [
    "Rounding is done up to 2 decimal places.",
    "✅ Useful for quick estimates and faster input.",
    "⚠️ May result in minor precision loss — not ideal for order placement.",
  ],
  Market: [
    "Values align with market multiples — typically steps of 0.05.",
    "✅ Best used when placing target or stop-loss orders.",
    "Its also gives slightly buffered values",
  ],
  Buffer: [
    "Rounding happens in steps of 0.1 for safer execution.",
    "✅ Use when placing risk-sensitive orders to avoid slippage.",
    "👍 Recommended for stop-loss and target setup to ensure reliability.",
  ],
};

export const derivedInputPoints = (label) => ({
  amount: [
    `${label} is automatically calculated using Buy Price, Sell Price, and Quantity.`,
    `✅ Use this when you want to unlink prices and compute potential profit.`,
    `🔁 Changes in Buy/Sell Price or Quantity will update ${label}.`,
  ],
  buyPrice: [
    `${label} is derived from Amount, Sell Price, and Quantity.`,
    `✅ Useful when targeting a specific profit and computing required Buy Price.`,
    `🔁 Altering Amount or Sell Price will adjust ${label}.`,
  ],
  sellPrice: [
    `${label} is derived from Buy Price, Amount, and Quantity.`,
    `✅ Use this when you've locked in Buy Price and want to compute ideal Sell Price.`,
    `🔁 Modifying Buy Price or Amount recalculates ${label}.`,
  ],
});
