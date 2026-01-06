import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTableStore } from "./store/useTableStore";

import { Toolbar } from "./ui/Toolbar/Toolbar";
import { TableHeader } from "./ui/Header/TableHeader";
import { Row } from "./ui/Row/Row";

import {
  AddColumnPopup,
  ColumnSettingsPopup,
  FilterPopup,
  SortPopup,
  SummaryPopup,
} from "./ui/Popups";

export function Table() {
  const tableRef = useRef(null);
  const scrollRef = useRef(null);

  const rowOrder = useTableStore((s) =>
    s.filteredRowOrder.length ? s.filteredRowOrder : s.rowOrder
  );
  const isDataLoading = useTableStore((s) => s.isDataLoading);

  const { initDemoData, addTrade, openPopup, deleteColumn } =
    useTableStore.getState();

  useEffect(() => {
    initDemoData();
  }, []);

  /* ---------------- Virtualizer ---------------- */

  const rowVirtualizer = useVirtualizer({
    count: rowOrder.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 31.3,
    overscan: 6,
  });

  return (
    <div className="flex flex-col flex-1 gap-4 relative">
      {/* POPUPS */}
      <SummaryPopup />
      <FilterPopup />
      <SortPopup />
      <ColumnSettingsPopup />
      <AddColumnPopup />

      {/* TOOLBAR */}
      <Toolbar
        onAddTrade={addTrade}
        onAddColumn={() => openPopup("add-column")}
        onFilter={() => openPopup("filter")}
        onSort={() => openPopup("sort")}
        onToggleSummary={() => openPopup("summary")}
        onDelete={deleteColumn}
        onOpenColumnSettings={() => openPopup("column-settings")}
      />

      {/* TABLE */}
      <div
        ref={tableRef}
        className="
          relative
          border border-(--border)
          rounded
          text-(--text)
          text-sm
          h-[430px]
          -mb-4
          w-full
          overflow-hidden
        "
      >
        {/* SCROLL CONTAINER */}
        <div ref={scrollRef} className="relative h-full w-full overflow-auto">
          <TableHeader tableRef={tableRef} />

          {/* BODY */}
          {isDataLoading ? (
            <div className="p-4 space-y-2 animate-pulse">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-6 bg-(--hover) rounded" />
              ))}
            </div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((vRow) => {
                const rowId = rowOrder[vRow.index];

                return (
                  <div
                    key={rowId}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "fit-content",
                      transform: `translateY(${vRow.start}px)`,
                    }}
                  >
                    <Row rowId={rowId} index={vRow.index} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
