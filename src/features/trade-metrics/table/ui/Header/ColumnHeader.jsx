import {
  GripHorizontal,
  Hourglass,
  LockKeyholeIcon,
  RefreshCcwDot,
} from "lucide-react";
import { useMemo, useRef } from "react";
import { useTableStore } from "@features/trade-metrics/table/store";
import { useTradeStore } from "@shared/stores";
import { SCHEMA_SOURCE, SEMANTIC_TYPE } from "@lib/analytics/schema";
import { DragResizeManager } from "@shared/components/ui/managers";
import { DragHandle, ResizeHandle } from "@shared/components/ui";
import { createDragResizeController } from "@shared/components/ui/controller";
import { hideTooltip, showTooltip } from "@shared/components/ui/tooltip";

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
      (column.semanticType === SEMANTIC_TYPE.DATETIME ? 200 : 150),
  );

  const isColEditable = column.source !== SCHEMA_SOURCE.COMPUTED;
  const isColUnlocked = useTableStore(
    (s) => s.lockedColumnsMap?.[colId] !== true,
  );

  const editable = isColUnlocked && isColEditable;

  const isBackendComputing = false;

  const {
    startColumnDrag,
    startColumnResize,
    endColumnResize,
    selectColumn,
    unselectColumn,
  } = useTableStore.getState();

  const manager = useMemo(() => {
    return new DragResizeManager({
      parentRef: tableRef,
      controllerFactory: createDragResizeController,
      mode: "x",

      onDragStart: ({ startX }) => {
        startColumnDrag({ id: colId, index });
      },

      onDragEnd: ({ lastIndex }) => endColumnResize({ index: lastIndex }),

      onResizeStart: () => {
        startColumnResize({ id: colId });
      },

      onResizeEnd: endColumnResize,
    });
  }, [colId, index]);

  return (
    <div
      ref={headerRef}
      data-col-header
      className={`group relative select-none overflow-hidden overflow-ellipsis text-nowrap pt-1.5
      ${isGroupColumn ? "stick-left text-(--text-muted) bg-(--surface-muted)" : ""}`}
      style={{ width }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        selectColumn({ id: colId, width: rect.width, left: rect.left });
      }}
    >
      {!isGroupColumn && (
        <DragHandle
          direction="top"
          onPointerDown={(e, dir) => manager.startDrag(e, headerRef.current)}
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
        className={`flex font-bold items-center px-2 py-1 border-r border-(--border) ${isBackendComputing ? "gap-2" : "justify-between"}`}
      >
        <span>{isBackendComputing ? "Computing..." : column.label}</span>
        {isBackendComputing && (
          <Hourglass
            size={13}
            className="animate-spin text-(--text-muted) min-w-3"
          />
        )}
        <div className="flex gap-2">
          {column.mode === "cumulative" && (
            <RefreshCcwDot
              size={13}
              className="hover:cursor-pointer hover:text-(--info)"
              onMouseEnter={(e) =>
                showTooltip(e, { content: "Recompute Over Current View" })
              }
              onMouseLeave={hideTooltip}
            />
          )}

          {!editable && (
            <LockKeyholeIcon
              size={13}
              onMouseEnter={(e) =>
                showTooltip(e, {
                  content: "Computed column - cannot be edited",
                })
              }
              onMouseLeave={hideTooltip}
            />
          )}
        </div>
      </div>
    </div>
  );
}
