import { useCallback } from "react";
import { generateTooltip, is, logObj, logResult, logStart } from "@RM/utils";
import { getKey } from "@RM/utils";

export default function useValidateAndNotify() {
  const validateAndNotify = useCallback(
    ({ name, field, buyPrice, sellPrice, state }) => {
      const prev = state[name + "Tooltip"];
      const isTargetOrSl = is.TOrSl(name);
      const opposite = is.oFL(field);
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
      if (isTargetOrSl && is.BS(field)) {
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
    },
    []
  );

  return validateAndNotify;
}
