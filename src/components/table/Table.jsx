import { useEffect, useRef } from "react";
import { useTableStore } from "./store";
import { Toolbar } from "./Toolbar/Toolbar";

import { TableHeader } from "./Header/TableHeader";
import { ColumnGhost } from "./Header/ColumnGhost";

import { Row } from "./Row/Row";
import { RowGhost } from "./Row/RowGhost";

import { MetricBuilder } from "./Popups/MetricBuilder";
import { SummaryPopup } from "./Popups/Summary";
import { FilterPopup } from "./Popups/Filter";
import { SortPopup } from "./Popups/Sort";
import { CellGhost } from "./Cell/CellGhost";

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
    <div className="flex flex-col gap-4 relative -mx-4 -mb-4">
      <MetricBuilder />
      <SummaryPopup />
      <FilterPopup />
      <SortPopup />
      <Toolbar
        onAddTrade={addTrade}
        onAddMetric={() => {
          openPopup("add-metric");
        }}
        onFilter={() => openPopup("filter")}
        onSort={() => openPopup("sort")}
        onToggleSummary={(e) => openPopup("summary")}
        onDelete={deleteColumn}
        onToggleReview={() => null}
        onToggleHeatmap={() => null}
        onResetLayout={() => null}
        onExport={() => null}
        onOpenColumnSettings={() => null}
      />

      {/* SINGLE SCROLL CONTAINER */}
      <div
        className="
          relative
          border border-(--border)
          rounded
          overflow-auto
          max-h-[435px]
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
        <CellGhost ref={tableRef} />
      </div>
    </div>
  );
}
