import { useCallback } from "react";
import { safe } from "@features/risk-management/utils";

export default function useCapitalHandler() {
  const handleCapitalChange = useCallback(({ val, state }) => {
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
  }, []);
  return handleCapitalChange;
}
