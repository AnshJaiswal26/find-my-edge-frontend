import { useLayoutEffect, useState } from "react";

export default function useFloatingPosition(active, ref) {
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!active || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const openDown = spaceBelow >= spaceAbove;

    setPos({
      placement: openDown ? "bottom" : "top",
      top: openDown ? rect.bottom + 3 : undefined,
      bottom: openDown ? undefined : viewportHeight - rect.top + 3,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(120, (openDown ? spaceBelow : spaceAbove) - 8),
    });
  }, [active]);

  return pos;
}
