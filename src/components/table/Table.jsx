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

export function Table() {
  const tableRef = useRef(null);

  const rowOrder = useTableStore((s) =>
    s.filteredRowOrder.length === 0 ? s.rowOrder : s.filteredRowOrder
  );
  const initDemoData = useTableStore((s) => s.initDemoData);
  const addTrade = useTableStore((s) => s.addTrade);
  const openPopup = useTableStore((s) => s.openPopup);

  useEffect(() => {
    initDemoData();
  }, []);

  return (
    <div className="flex flex-col gap-4 relative">
      <MetricBuilder />
      <SummaryPopup />
      <FilterPopup />
      <Toolbar
        onAddTrade={addTrade}
        onAddMetric={() => {
          openPopup("add-metric");
        }}
        onFilter={() => openPopup("filter")}
        onToggleSummary={(e) => openPopup("summary")}
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
          max-h-[410px]
          w-full
          text-(--text)
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
