import { useEffect } from "react";
import { dismissManager } from "@shared/components/ui/managers/index.js";

export function useGlobalEvents(events, callback) {
  useEffect(() => {
    if (!events || !callback) return;
    return dismissManager.register(events, callback);
  }, []);
}
