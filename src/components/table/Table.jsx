import { useEffect, useRef } from "react";
import { useTableStore } from "./store";
import { Toolbar } from "./Toolbar/Toolbar";

import { TableHeader } from "./Header/TableHeader";
import { ColumnGhost } from "./Header/ColumnGhost";

import { Row } from "./Row/Row";
import { RowGhost } from "./Row/RowGhost";

import {
  AddColumnPopup,
  ColumnSettingsPopup,
  FilterPopup,
  SortPopup,
  SummaryPopup,
} from "./Popups";

export function Table() {
  const tableRef = useRef(null);

  const rowOrder = useTableStore((s) =>
    s.filteredRowOrder.length === 0 ? s.rowOrder : s.filteredRowOrder
  );

  const { initDemoData, addTrade, openPopup, deleteColumn } =
    useTableStore.getState();

  useEffect(() => {
    initDemoData();
  }, []);

  return (
    <div className="flex flex-col flex-1 h-full justify-between -mb-4 gap-4 relative">
      <SummaryPopup />
      <FilterPopup />
      <SortPopup />
      <ColumnSettingsPopup />
      <AddColumnPopup />

      <Toolbar
        onAddTrade={addTrade}
        onAddColumn={() => openPopup("add-column")}
        onFilter={() => openPopup("filter")}
        onSort={() => openPopup("sort")}
        onToggleSummary={(e) => openPopup("summary")}
        onDelete={deleteColumn}
        onToggleReview={() => null}
        onToggleHeatmap={() => null}
        onResetLayout={() => null}
        onExport={() => null}
        onOpenColumnSettings={() => openPopup("column-settings")}
      />

      {/* SINGLE SCROLL CONTAINER */}
      <div
        className="
          relative
          border border-(--border)
          rounded
          overflow-auto
          max-h-[430px]
          w-full
          text-(--text)
          text-sm
        "
      >
        <div className="relative min-w-max" ref={tableRef}>
          <TableHeader />

          {rowOrder.map((rowId, index) => (
            <Row key={rowId} rowId={rowId} index={index} />
          ))}
        </div>
        <ColumnGhost ref={tableRef} />
        <RowGhost ref={tableRef} />
      </div>
    </div>
  );
}
