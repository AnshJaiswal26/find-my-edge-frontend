import { useRef } from "react";
import { useTableStore } from "./store";

import { Toolbar } from "./ui/Toolbar/Toolbar";
import { TableHeader } from "./ui/Header/TableHeader";
import VirtualizedRow from "./ui/Row/VirtualizedRows";
import Popups from "./ui/Popups";
import { Loader } from "@shared/components/ui";
import { DhanConnectCard } from "@features/dashboard/components/feature";

export function Table() {
  const tableRef = useRef(null);

  const addRow = useTableStore((s) => s.addRow);
  const openPopup = useTableStore((s) => s.openPopup);
  const deleteColumn = useTableStore((s) => s.deleteColumn);

  const columnOrder = useTableStore((s) => s.columnsOrder);

  if (columnOrder.length === 0) return <DhanConnectCard />;

  const isDataLoading = useTableStore((s) => s.isDataLoading);

  if (isDataLoading) return <Loader />;

  return (
    <div className="flex flex-col flex-1 gap-4 relative -m-3">
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
    </div>
  );
}
