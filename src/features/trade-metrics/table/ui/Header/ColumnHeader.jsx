import { GripHorizontal, LockKeyholeIcon, RefreshCcwDot } from "lucide-react";
import { useMemo, useRef } from "react";
import { useTableStore } from "@features/trade-metrics/table/store";
import { createColumnDragController } from "@features/trade-metrics/table/interaction/columnDragController";
import { useTradeStore } from "@shared/stores";
import {
  hideTooltip,
  showTooltip,
} from "@shared/components/ui/tooltip/index.js";
import { SchemaSource, SemanticType } from "@lib/analytics/schema";
import { DragResizeManager } from "@shared/components/ui/managers";
import { DragHandle, ResizeHandle } from "@shared/components/ui";

export function ColumnHeader(props) {
  const isHidden = useTradeStore(
    (s) => s.schemasById[props.colId].hidden === true,
  );

  if (isHidden) return null;
  return <ColumnHeaderContent {...props} />;
}

function ColumnHeaderContent({ colId, index, tableRef, isGroupColumn }) {
  const headerRef = useRef(null);

  const column = useTradeStore((s) => s.schemasById[colId]);
  const width = useTableStore(
    (s) =>
      s.columnWidths[colId] ??
      (column.semanticType === SemanticType.DATETIME ? 200 : 150),
  );

  const isColEditable = column.source !== SchemaSource.COMPUTED;
  const isColUnlocked = useTableStore(
    (s) => s.lockedColumnsMap?.[colId] !== true,
  );

  const editable = isColUnlocked && isColEditable;

  const {
    startColumnDrag,
    startColumnResize,
    endColumnDrag,
    selectColumn,
    unselectColumn,
  } = useTableStore.getState();

  const manager = useMemo(() => {
    return new DragResizeManager({
      parentRef: tableRef,
      controllerFactory: createColumnDragController,
      mode: "x",

      onDragStart: ({ startX }) => {
        startColumnDrag({ id: colId, index });
      },

      onDragEnd: ({ lastIndex }) => endColumnDrag({ index: lastIndex }),

      onResizeStart: () => {
        startColumnResize({ id: colId });
      },

      onResizeEnd: endColumnDrag,
    });
  }, [colId, index]);

  return (
    <div
      ref={headerRef}
      data-col-header
      className={`group relative select-none overflow-hidden overflow-ellipsis text-nowrap 
      ${isGroupColumn ? "stick-left text-(--text-muted) bg-(--surface-muted)" : ""}`}
      style={{ width }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        selectColumn({ id: colId, width: rect.width, left: rect.left });
      }}
    >
      {!isGroupColumn && (
        <DragHandle
          direction="bottom"
          onPointerDown={(e, dir) =>
            manager.startDrag(e, headerRef.current, dir)
          }
          className="opacity-0 group-hover:opacity-60"
        >
          <GripHorizontal size={18} />
        </DragHandle>
      )}

      <ResizeHandle
        onPointerDown={(e, direction) =>
          manager.startResize(e, headerRef.current, direction)
        }
      />

      <div
        className={`flex font-bold items-center px-2 py-1 border-r border-(--border) justify-between`}
      >
        <span
          onMouseEnter={(e) =>
            column.formula
              ? showTooltip(e, column.formula.replace(/[\[\]]/g, ""))
              : null
          }
          onMouseLeave={() => (column.formula ? hideTooltip() : null)}
        >
          {column.label}
        </span>
        <div className="flex gap-2">
          {column.mode === "cumulative" && (
            <RefreshCcwDot
              size={13}
              className="hover:cursor-pointer hover:text-(--info)"
              onMouseEnter={(e) =>
                showTooltip(e, "Recompute Over Current View")
              }
              onMouseLeave={hideTooltip}
            />
          )}
          {!editable && (
            <LockKeyholeIcon
              size={13}
              onMouseEnter={(e) =>
                showTooltip(e, "Computed column - cannot be edited")
              }
              onMouseLeave={hideTooltip}
            />
          )}
        </div>
      </div>
    </div>
  );
}
