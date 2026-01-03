import { useEffect, useRef, useState } from "react";
import { List } from "react-window";
import { useTableStore } from "./store/useTableStore";

import { Toolbar } from "./ui/Toolbar/Toolbar";
import { TableHeader } from "./ui/Header/TableHeader";
import { ColumnGhost } from "./ui/Header/ColumnGhost";
import { Row } from "./ui/Row/Row";

import {
  AddColumnPopup,
  ColumnSettingsPopup,
  FilterPopup,
  SortPopup,
  SummaryPopup,
} from "./ui/Popups";

/* ---------------- Virtual Row ---------------- */

function VirtualRow({ index, style, rowOrder }) {
  style.width = "fit-content";

  // HEADER
  if (index === 0) {
    return (
      <div style={style}>
        <TableHeader />
      </div>
    );
  }

  // DATA ROWS
  const rowIndex = index - 1;
  const rowId = rowOrder[rowIndex];

  return (
    <div style={style}>
      <Row rowId={rowId} index={rowIndex} />
    </div>
  );
}

/* ---------------- Table ---------------- */

export function Table() {
  const tableRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const rowOrder = useTableStore((s) =>
    s.filteredRowOrder?.length ? s.filteredRowOrder : s.rowOrder
  );

  const isDataLoading = useTableStore((s) => s.isDataLoading);

  const { initDemoData, addTrade, openPopup, deleteColumn } =
    useTableStore.getState();

  useEffect(() => {
    initDemoData();

    if (!tableRef.current) return;

    const ro = new ResizeObserver(([entry]) => {
      setViewportWidth(entry.contentRect.width);
    });

    ro.observe(tableRef.current);
    return () => ro.disconnect();
  }, []);

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
          h-[420px]
          w-full
          -mb-4
          overflow-hidden
        "
      >
        {/* <TableHeader /> */}
        {/* BODY (virtualized, owns scrolling) */}
        {isDataLoading ? (
          <div className="p-4 space-y-2 animate-pulse">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-6 bg-(--hover) rounded" />
            ))}
          </div>
        ) : (
          <List
            height={400}
            rowCount={rowOrder.length + 1}
            rowHeight={31.3}
            rowComponent={VirtualRow}
            rowProps={{ rowOrder }}
            overscanCount={4}
          />
        )}
        {/* GHOSTS */}
        <ColumnGhost ref={tableRef} />
        {/* <RowGhost ref={tableRef} /> */}
      </div>
    </div>
  );
}
