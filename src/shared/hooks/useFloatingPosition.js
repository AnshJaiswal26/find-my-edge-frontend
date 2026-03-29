import { useEffect } from "react";
import { positionElement } from "../utils";

export function useFloatingPosition(active, targetRef, elementRef, options) {
  useEffect(() => {
    if (active) {
      positionElement(targetRef.current, elementRef.current, options);
    }
  }, [active]);
}
