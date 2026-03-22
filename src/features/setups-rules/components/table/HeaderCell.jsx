import { CellWrapper } from "../layout";
import { useMemo, useRef } from "react";
import { useTradeSetupStore } from "@shared/stores";
import { DragResizeManager } from "@shared/components/ui/managers";
import { createDragResizeController } from "@shared/components/ui/controller";
import { ResizeHandle } from "@shared/components/ui";
import { Cell } from "../ui";

export function HeaderCell({ text, index, setupId, tableRef }) {
  const headerRef = useRef(null);

  const startColumnResize = useTradeSetupStore((s) => s.startColumnResize);
  const endColumnResize = useTradeSetupStore((s) => s.endColumnResize);

  const manager = useMemo(() => {
    return new DragResizeManager({
      parentRef: tableRef,
      controllerFactory: createDragResizeController,
      mode: "x",

      onResizeStart: () => {
        startColumnResize(index);
      },

      onResizeEnd: ({ width }) => endColumnResize(width, index, setupId),
    });
  }, [index]);

  return (
    <CellWrapper ref={headerRef}>
      <ResizeHandle
        onPointerDown={(e, dir) =>
          manager.startResize(e, headerRef.current, dir)
        }
      />
      <Cell text={text} index={index} setupId={setupId} />
    </CellWrapper>
  );
}
