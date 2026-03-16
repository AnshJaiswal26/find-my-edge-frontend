import { useEffect, useState } from "react";
import { chartEngine } from "../model/chartEngine";

export default function useChartEngineEvent(event) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = chartEngine.on(event, () => {
      setTick((t) => t + 1);
    });

    return unsubscribe;
  }, [event]);
}
