import { GripHorizontal, LockKeyholeIcon, RefreshCcwDot } from "lucide-react";
import { useRef } from "react";
import { useTableStore } from "@features/trade-metrics/table/store";
import { createColumnDragController } from "@features/trade-metrics/table/interaction/columnDragController";
import { useTradeStore } from "@shared/stores";
import { showTooltip, hideTooltip } from "@shared/components/ui/tooltip";
import { SchemaSource } from "@lib/analytics/schema";

const controller = createColumnDragController();

function getColumnRects(tableEl) {
  return Array.from(tableEl.querySelectorAll("[data-col-header]")).map(
    (el, index) => {
      const r = el.getBoundingClientRect();
      return { index, left: r.left, right: r.right };
    },
  );
}
export function ColumnHeader(props) {
  const isHidden = useTradeStore(
    (s) => s.schemasById[props.colId].hidden === true,
  );
  console.log(isHidden);
  if (isHidden) return null;
  return <ColumnHeaderContext {...props} />;
}

function ColumnHeaderContext({ colId, index, tableRef, isGroupColumn }) {
  const headerRef = useRef(null);

  const column = useTradeStore((s) => s.schemasById[colId]);
  const width = useTableStore((s) => s.columnWidths?.[colId] ?? 150);
  const isColEditable = column.source !== SchemaSource.COMPUTED;
  const isColUnlocked = useTableStore(
    (s) => s.lockedColumnsMap?.[colId] !== true,
  );

  const editable = isColUnlocked && isColEditable;

  const {
    startColumnDrag,
    startColumnResize,
    setColDragOverIndex,
    endColumnDrag,
    selectColumn,
    unselectColumn,
  } = useTableStore.getState();

  const handlePointerDown = (e, mode) => {
    e.preventDefault();
    unselectColumn();

    const headerEl = headerRef.current;
    const tableEl = tableRef.current;

    const rect = headerEl.getBoundingClientRect();
    const tableRect = tableEl.getBoundingClientRect();

    const startX = e.clientX;
    const columnRects = getColumnRects(tableEl);

    if (mode === "drag") {
      startColumnDrag({ id: colId, index });
    } else {
      startColumnResize({ id: colId });
    }

    controller.start({
      rect,
      tableRect,
      mode: mode === "drag" ? "reorder" : "resize",
    });

    function onMove(ev) {
      const x = ev.clientX;
      const deltaX = x - startX;

      if (mode === "drag") {
        controller.move(deltaX);

        for (const col of columnRects) {
          if (x > col.left + 6 && x < col.right - 6) {
            setColDragOverIndex(col.index);
            break;
          }
        }
      } else {
        controller.resize(Math.max(40, rect.width + deltaX));
      }
    }

    function onUp(ev) {
      controller.end();

      if (mode === "resize") {
        const finalWidth = Math.max(60, rect.width + (ev.clientX - startX));
        endColumnDrag({ width: finalWidth });
      } else {
        endColumnDrag();
      }

      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

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
        <div
          onPointerDown={(e) => handlePointerDown(e, "drag")}
          className="opacity-0 group-hover:opacity-60 absolute -bottom-1 left-1/2 -translate-x-1/2 cursor-grab"
        >
          <GripHorizontal size={18} />
        </div>
      )}

      <div
        onPointerDown={(e) => handlePointerDown(e, "resize")}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-(--cyan)"
      />

      <div
        className={`flex font-bold items-center px-2 py-1 border-r border-(--border) justify-between`}
      >
        {column.label}
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
          {!editable && <LockKeyholeIcon size={13} />}
        </div>
      </div>
    </div>
  );
}
