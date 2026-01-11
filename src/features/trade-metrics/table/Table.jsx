import { useEffect, useRef } from "react";
import { useTableStore } from "./store/useTableStore";

import { Toolbar } from "./ui/Toolbar/Toolbar";
import { TableHeader } from "./ui/Header/TableHeader";
import { VirtualizedRow } from "./ui/Row/Row";

import {
  AddColumnPopup,
  ColumnSettingsPopup,
  FilterPopup,
  GroupBy,
  SortPopup,
  SummaryPopup,
} from "./ui/Popups";

export function Table() {
  const tableRef = useRef(null);

  const { initDemoData, addTrade, openPopup, deleteColumn } =
    useTableStore.getState();

  useEffect(() => {
    initDemoData();
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-4 relative">
      {/* POPUPS */}
      <SummaryPopup />
      <FilterPopup />
      <SortPopup />
      <ColumnSettingsPopup />
      <AddColumnPopup />
      <GroupBy />

      {/* TOOLBAR */}
      <Toolbar
        onAddTrade={addTrade}
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
