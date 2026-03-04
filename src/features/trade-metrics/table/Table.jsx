import { useEffect, useRef } from "react";
import { useTableStore } from "./store";

import { Toolbar } from "./ui/Toolbar/Toolbar";
import { TableHeader } from "./ui/Header/TableHeader";
import VirtualizedRow from "./ui/Row/VirtualizedRows";
import Popups from "./ui/Popups";
import { NoTradesEmptyState, Skeleton } from "@shared/components/ui";
import { useTradeStore } from "@shared/stores";

export function Table() {
  const tableRef = useRef(null);

  const initTradeMetricTable = useTableStore((s) => s.initTradeMetricTable);

  const addRow = useTableStore((s) => s.addRow);
  const openPopup = useTableStore((s) => s.openPopup);
  const deleteColumn = useTableStore((s) => s.deleteColumn);

  const isEmpty = useTradeStore((s) => s.tradesOrder.length === 0);

  const isInitializing = useTableStore((s) => s.isInitializing);

  useEffect(() => {
    initTradeMetricTable();
  }, []);

  if (isInitializing)
    return (
      <div className="flex flex-col gap-4 w-full -m-3 justify-self-center">
        <Skeleton width="100%" height="10vh" />
        <Skeleton width="100%" height="73vh" />
      </div>
    );

  return (
    <div className="flex flex-col flex-1 gap-4 relative -m-2">
      <Popups />
      <Toolbar
        onAddTrade={addRow}
        onAddColumn={() => openPopup("add-column")}
        onFilter={() => openPopup("filter")}
        onSort={() => openPopup("sort")}
        onGroup={() => openPopup("group")}
        onToggleSummary={() => openPopup("summary")}
        onDelete={deleteColumn}
        onOpenColumnSettings={() => openPopup("column-settings")}
      />
      {/* SCROLL CONTAINER */}

      {isEmpty ? (
        <NoTradesEmptyState className="!min-h-[70vh]" />
      ) : (
        <div
          ref={tableRef}
          className="
          relative
          border border-(--border)
          rounded
          text-(--text)
          text-sm
          max-h-[440px]
          w-full
          overflow-auto
        "
        >
          <div className="min-w-max relative">
            <TableHeader tableRef={tableRef} />
            <VirtualizedRow scrollRef={tableRef} />
          </div>
        </div>
      )}
    </div>
  );
}
