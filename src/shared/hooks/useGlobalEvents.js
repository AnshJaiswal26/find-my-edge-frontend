import { useEffect, useRef } from "react";
import { dismissManager } from "@shared/components/ui/managers";

export function useGlobalEvents(events, callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!events?.length) return;

    const handler = (e) => {
      callbackRef.current?.(e);
    };

    return dismissManager.register(events, handler);
  }, [events]);
}
