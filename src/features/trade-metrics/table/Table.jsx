import { useRef } from "react";
import { useTableStore } from "./store/useTableStore";

import { Toolbar } from "./ui/Toolbar/Toolbar";
import { TableHeader } from "./ui/Header/TableHeader";
import VirtualizedRow from "./ui/Row/VirtualizedRows";
import Popups from "./ui/Popups";
import { Loader } from "@layout";

export function Table() {
  const tableRef = useRef(null);

  const { addRow, openPopup, deleteColumn } = useTableStore.getState();

  const isDataLoading = useTableStore((s) => s.isDataLoading);

  if (isDataLoading) return <Loader />;

  return (
    <div className="flex flex-col flex-1 gap-4 relative">
      <Popups />

      {/* TOOLBAR */}
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

      {/* TABLE */}
      <div
        ref={tableRef}
        className="
        relative
        border border-(--border)
        rounded
        text-(--text)
        text-sm
        max-h-[430px]
        -mb-4
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
