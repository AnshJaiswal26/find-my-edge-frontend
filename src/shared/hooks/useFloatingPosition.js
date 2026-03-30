import { useEffect } from "react";
import { positionElement } from "../utils";

export function useFloatingPosition(targetRef, elementRef, options = {}) {
  const { observeResize = false } = options;

  useEffect(() => {
    const targetEl = targetRef?.current;
    const floatingEl = elementRef?.current;

    if (!targetEl || !floatingEl) return;

    const updatePosition = () => {
      positionElement(targetEl, floatingEl, options);
    };

    // initial position
    updatePosition();

    if (!observeResize) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updatePosition);
    });

    observer.observe(floatingEl);

    return () => observer.disconnect();
  }, [options, targetRef, elementRef]);
}
