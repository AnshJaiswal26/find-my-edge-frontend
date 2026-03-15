import { GridStack } from "gridstack";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";

function getColumnCount(breakpoints) {
  const w = window.innerWidth;

  if (w < 480) return breakpoints.min;
  if (w < 768) return breakpoints.sm;
  if (w < 1024) return breakpoints.md;
  return breakpoints.lg;
}

const syncLayoutDebounced = debounce(
  (onChange) => {
    onChange();
  },
  800,
  { maxWait: 2000 },
);

export default function useGridStack(
  gridRef,
  {
    order,
    idPrefix = "",
    onLayoutChange = () => {},
    // user configurable
    columns = { min: 6, sm: 12, md: 20, lg: 30 },
    float = false,
    resizable = { handles: "" },
    draggable = { handle: ".grid-item-drag" },
    animate = false,
  },
) {
  const grid = useRef(null);
  const isResponsiveChange = useRef(false);

  useEffect(() => {
    if (!gridRef.current || grid.current) return;

    // INIT GRID ONLY ONCE (after items exist)
    const instance = GridStack.init(
      {
        column: getColumnCount(columns),
        float,
        resizable,
        draggable,
        animate,
      },
      gridRef.current,
    );

    grid.current = instance;

    /* ------------------ EVENTS ------------------ */

    const handleChange = () => {
      if (isResponsiveChange.current) return;

      const layout = Object.fromEntries(
        instance
          .save()
          .map(({ id, x, y, w, h }) => (id ? [id, { x, y, w, h }] : null))
          .filter(Boolean),
      );

      syncLayoutDebounced(() => onLayoutChange(layout));
    };

    instance.on("change", handleChange);

    /* ------------------ RESPONSIVE ------------------ */

    const updateColumns = () => {
      if (!grid.current) return;

      isResponsiveChange.current = true;
      instance.column(getColumnCount(columns), "move");

      requestAnimationFrame(() => {
        isResponsiveChange.current = false;
      });
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    /* ------------------ CLEANUP ------------------ */

    return () => {
      window.removeEventListener("resize", updateColumns);

      if (grid.current) {
        grid.current.destroy(false);
        grid.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!grid.current || !gridRef.current || !order?.length) return;

    const instance = grid.current;

    requestAnimationFrame(() => {
      instance.batchUpdate(true); // prevent multiple reflows

      order.forEach((id) => {
        const el = gridRef.current?.querySelector(`[gs-id="${idPrefix}${id}"]`);

        if (el && !el.gridstackNode) {
          instance.makeWidget(el);
        }
      });

      instance.batchUpdate(false); // apply once
    });
  }, [order]);
}
