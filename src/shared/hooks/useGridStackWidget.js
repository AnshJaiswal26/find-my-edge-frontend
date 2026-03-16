import { useEffect } from "react";

export default function useGridStackWidget(ref) {
  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    const grid = el.closest(".grid-stack")?.gridstack;
    if (!grid) {
      requestAnimationFrame(() => {
        const g = el.closest(".grid-stack")?.gridstack;
        if (g && !el.gridstackNode) {
          g.makeWidget(el);
        }
      });
      return;
    }

    if (!el.gridstackNode) {
      grid.batchUpdate(true);
      grid.makeWidget(el);
      grid.batchUpdate(false);
    }

    return () => {
      if (el.gridstackNode) {
        grid.batchUpdate(true);
        grid.removeWidget(el);
        grid.batchUpdate(false);

        grid.compact();
      }
    };
  }, [ref]);
}
