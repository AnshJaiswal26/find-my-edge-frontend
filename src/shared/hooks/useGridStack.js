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

export function useGridStack({
  onLayoutChange = () => {},
  columns = { min: 6, sm: 12, md: 20, lg: 30 },
  float = false,
  resizable = { handles: "" },
  animate = false,
}) {
  const containerRef = useRef(null);
  const grid = useRef(null);
  const isResponsiveChange = useRef(false);

  useEffect(() => {
    if (!containerRef.current || grid.current) return;

    const instance = GridStack.init(
      {
        column: getColumnCount(columns),
        float,
        resizable,
        draggable: {
          handle: ".grid-item-drag",
          appendTo: "body",
          scroll: true,
        },
        animate,
        margin: 8,
      },
      containerRef.current,
    );

    grid.current = instance;

    /* ------------------ EVENTS ------------------ */

    instance.on("change", () => {
      if (isResponsiveChange.current) return;

      const layout = Object.fromEntries(
        instance
          .save()
          .map(({ id, x, y, w, h }) => (id ? [id, { x, y, w, h }] : null))
          .filter(Boolean),
      );

      syncLayoutDebounced(() => onLayoutChange(layout));
    });

    instance.on("removed", () => {
      console.log("removed");
      instance.compact();
    });

    /* ------------------ RESPONSIVE ------------------ */

    const updateColumns = debounce(() => {
      if (!grid.current) return;

      const newCols = getColumnCount(columns);

      if (grid.current.getColumn() === newCols) return;

      isResponsiveChange.current = true;

      grid.current.batchUpdate(true);

      grid.current.column(newCols);
      grid.current.compact();

      grid.current.engine.nodes.forEach((n) => {
        if (n.x + n.w > newCols) {
          n.x = Math.max(0, newCols - n.w);
        }
      });

      grid.current.batchUpdate(false);

      requestAnimationFrame(() => {
        isResponsiveChange.current = false;
      });
    }, 150);

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => {
      window.removeEventListener("resize", updateColumns);

      if (grid.current) {
        grid.current.destroy(false);
        grid.current = null;
      }
    };
  }, []);

  //  RETURN register function ALSO
  return { grid, containerRef };
}
