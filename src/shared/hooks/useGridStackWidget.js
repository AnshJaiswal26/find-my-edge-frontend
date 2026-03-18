// export default function useGridStackWidget(ref, gridRef) {
//   useEffect(() => {
//     const el = ref?.current;
//     const grid = gridRef?.current;
//     if (!el || !grid) return;
//
//     if (!grid) {
//       requestAnimationFrame(() => {
//         if (grid && !el.gridstackNode) {
//           grid.makeWidget(el);
//         }
//       });
//       return;
//     }
//
//     return () => {
//       if (el.gridstackNode) {
//         grid.removeWidget(el, true, true);
//         grid.compact();
//       }
//     };
//   }, [ref]);
// }

import { useCallback, useEffect, useRef } from "react";

export default function useGridStackWidget(gridRef) {
  const elementRef = useRef(null);
  const initWidget = useCallback(
    (el) => {
      if (!el) return;

      const grid = gridRef?.current;
      if (!grid) return;

      if (!el.gridstackNode) {
        elementRef.current = el;
        grid.makeWidget(el);
      }
    },
    [gridRef],
  );

  useEffect(() => {
    return () => {
      const grid = gridRef?.current;
      if (grid && elementRef.current) {
        grid.removeWidget(elementRef.current, true, true);
      }
    };
  }, []);

  return initWidget;
}
