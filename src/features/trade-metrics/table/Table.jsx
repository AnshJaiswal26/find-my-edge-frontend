import { useEffect, useRef } from "react";
import { useTableStore } from "./store/useTableStore";

import { Toolbar } from "./ui/Toolbar/Toolbar";
import { TableHeader } from "./ui/Header/TableHeader";
import VirtualizedRow from "./ui/Row/VirtualizedRows";
import Popups from "./ui/Popups";
import { Loader } from "@layout";

export function Table() {
  const tableRef = useRef(null);

  const setScrollEdge = useTableStore((s) => s.setScrollEdge);
  const addRow = useTableStore((s) => s.addRow);
  const openPopup = useTableStore((s) => s.openPopup);
  const deleteColumn = useTableStore((s) => s.deleteColumn);

  const isDataLoading = useTableStore((s) => s.isDataLoading);

  /* -------- Detect horizontal scroll edge -------- */
  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        const { scrollLeft, scrollWidth, clientWidth } = el;
        const maxScrollLeft = scrollWidth - clientWidth;
        const midpoint = maxScrollLeft / 2;

        if (scrollLeft < midpoint) {
          setScrollEdge("left");
        } else {
          setScrollEdge("right");
        }

        ticking = false;
      });
    };

    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [setScrollEdge]);

  if (isDataLoading) return <Loader />;

  return (
    <div className="flex flex-col flex-1 gap-4 relative">
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
