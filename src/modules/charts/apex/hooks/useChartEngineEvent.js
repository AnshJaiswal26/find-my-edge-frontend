import { useEffect } from "react";
import { chartEngine } from "../model/chartEngine";

export default function useChartEngineEvent(event, callback) {
  useEffect(() => {
    const unsubscribe = chartEngine.on(event, callback);

    return unsubscribe;
  }, [event]);
}
