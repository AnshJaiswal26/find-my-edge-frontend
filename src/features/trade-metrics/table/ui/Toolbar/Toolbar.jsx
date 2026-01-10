import {
  Filter,
  ArrowUpDown,
  Flame,
  Download,
  RotateCcw,
  LayoutGrid,
  ColumnsSettings,
  Trash2,
  Rows3,
  Columns3,
} from "lucide-react";
import { Button } from "@ui";
import { Divider } from "@layout";
import { useTableStore } from "../../store/useTableStore";
import { ColumnInspector } from "../Column/ColumnInspector";

export function Toolbar({
  onAddTrade,
  onAddColumn,
  onFilter,
  onSort,
  onDelete,
  onToggleSummary,
  onToggleHeatmap,
  onResetLayout,
  onExport,
  onOpenColumnSettings,
}) {
  const isFilterApplied = useTableStore((s) => s.filters.length !== 0);
  const isSortingApplied = useTableStore((s) => s.sort.columnId !== null);

  return (
    <div
      className="
        border border-(--border)
        bg-(--surface-muted)
        flex flex-col
      "
    >
      {/* TOP ROW: ACTIONS + INSPECTOR */}
      <div
        className="
          grid grid-cols-[1fr_auto]
          items-center
          px-6 py-2
          gap-6
        "
      >
        {/* ACTION GROUPS */}
        <div className="flex items-center gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-1">
            <Button.Icon
              disabled={isFilterApplied}
              tooltip={{ text: "Add Trade", position: "bottom" }}
              onClick={onAddTrade}
            >
              <Rows3 size={16} />
            </Button.Icon>

            <Button.Icon
              tooltip={{ text: "Add Column", position: "bottom" }}
              onClick={onAddColumn}
            >
              <Columns3 size={16} />
            </Button.Icon>

            <Button.Icon
              className={isFilterApplied ? "bg-(--hover)!" : ""}
              tooltip={{ text: "Filter Trades", position: "bottom" }}
              onClick={onFilter}
            >
              <Filter size={16} />
            </Button.Icon>

            <Button.Icon
              className={isSortingApplied ? "bg-(--hover)!" : ""}
              tooltip={{ text: "Sort", position: "bottom" }}
              onClick={onSort}
            >
              <ArrowUpDown size={16} />
            </Button.Icon>

            <Button.Icon
              tooltip={{ text: "Delete Selected", position: "bottom" }}
              onClick={onDelete}
            >
              <Trash2 size={16} />
            </Button.Icon>
          </div>

          <Divider vertical />

          {/* CENTER */}
          <div className="flex items-center gap-1">
            <Button.Icon
              tooltip={{ text: "Summary View", position: "bottom" }}
              onClick={onToggleSummary}
            >
              <LayoutGrid size={16} />
            </Button.Icon>

            <Button.Icon
              tooltip={{ text: "Heatmap", position: "bottom" }}
              onClick={onToggleHeatmap}
            >
              <Flame size={16} />
            </Button.Icon>
          </div>

          <Divider vertical />

          {/* RIGHT */}
          <div className="flex items-center gap-1">
            <Button.Icon
              tooltip={{ text: "Column Settings", position: "bottom" }}
              onClick={onOpenColumnSettings}
            >
              <ColumnsSettings size={16} />
            </Button.Icon>

            <Button.Icon
              tooltip={{ text: "Reset Layout", position: "bottom" }}
              onClick={onResetLayout}
            >
              <RotateCcw size={16} />
            </Button.Icon>

            <Button.Icon
              tooltip={{ text: "Export Data", position: "bottom" }}
              onClick={onExport}
            >
              <Download size={16} />
            </Button.Icon>
          </div>
        </div>

        {/* INSPECTOR SLOT */}
        <div className="flex items-center justify-end min-w-[260px]">
          <ColumnInspector />
        </div>
      </div>
    </div>
  );
}
