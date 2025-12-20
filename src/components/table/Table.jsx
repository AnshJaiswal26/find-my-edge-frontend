// components/Table.jsx
import { useEffect } from "react";
import { useTableStore } from "./store";
import { TableHeader } from "./TableHeader";
import { Row } from "./Row";
import { Toolbar } from "./Toolbar";
import { MetricBuilder } from "./MetricBuilder";

const Ghost = () => {
  const draggingColumn = useTableStore((s) => s.draggingColumn);
  const dragX = useTableStore((s) => s.dragX);
  const resizeWidth = useTableStore((s) => s.resizeWidth);
  const dragMode = useTableStore((s) => s.dragMode);

  if (!draggingColumn) return null;

  return (
    <div
      className={`
        pointer-events-none
        absolute
        bg-(--cyan-soft)
        border-(--cyan-soft)
        rounded
        shadow-xl
        h-full
        top-0 ${dragMode !== "reorder" ? "border-r-5!" : "border-x-5!"}
      `}
      style={{
        left:
          (dragMode === "reorder"
            ? draggingColumn.left + dragX
            : draggingColumn.left) - 22,
        width: dragMode === "resize" ? resizeWidth : draggingColumn.width,
        zIndex: 50,
      }}
    />
  );
};

export function Table() {
  const rowOrder = useTableStore((s) => s.rowOrder);
  const initDemoData = useTableStore((s) => s.initDemoData);
  const addTrade = useTableStore((s) => s.addTrade);
  const openPopup = useTableStore((s) => s.openPopup);

  useEffect(() => {
    initDemoData();
  }, []);

  return (
    <div className="flex flex-col gap-4 relative">
      <MetricBuilder />
      <Toolbar
        onAddTrade={addTrade}
        onAddMetric={() => {
          console.log("clicked");
          openPopup("add-metric");
        }}
        onToggleSummary={() => null}
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
        <div className="relative min-w-max">
          <TableHeader />

          {rowOrder.map((rowId, index) => (
            <Row key={rowId} rowId={rowId} index={index} />
          ))}
        </div>
        <Ghost />
      </div>
    </div>
  );
}
