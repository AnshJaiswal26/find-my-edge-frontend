import {
  ArrowUpDown,
  CheckCircle2,
  Columns3,
  ColumnsSettings,
  Download,
  Filter,
  Flame,
  Group,
  LayoutGrid,
  Loader2,
  RotateCcw,
  Rows3,
} from "lucide-react";
import { Button } from "@shared/components/ui";
import { useTableStore } from "@features/trade-metrics/table/store";
import { useTradeStore } from "@shared/stores";
import { useState } from "react";
import {
  hideTooltip,
  showTooltip,
} from "@shared/components/ui/tooltip/index.js";

export function Toolbar({
  onAddTrade,
  onAddColumn,
  onFilter,
  onSort,
  onGroup,
  onToggleSummary,
  onToggleHeatmap,
  onResetLayout,
  onExport,
  onOpenColumnSettings,
}) {
  const isFilterApplied = useTableStore((s) => s.filteredRowOrder.length !== 0);
  const isSortingApplied = useTableStore((s) => s.sort.columnId !== null);
  const isGroupingApplied = useTableStore((s) => s.groupBy !== null);

  const isSavingLayout = useTableStore((s) => s.isSavingLayout);

  const isSaving = useTradeStore((s) => s.isSaving);
  const pendingUpdates = useTradeStore((s) => s.pendingUpdates);
  const pending = Object.keys(pendingUpdates).length;

  const [isAdding, setIsAdding] = useState(false);

  const handleAddTrade = async () => {
    if (isAdding) return;
    setIsAdding(true);
    onAddTrade();
    setTimeout(() => setIsAdding(false), 200);
  };

  return (
    <div
      className="
        border border-(--border)
        bg-(--surface-muted)
        px-4 py-2
        flex items-center justify-between
      "
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* PRIMARY */}
        <div className="flex items-center gap-1">
          <Button.Icon
            onClick={handleAddTrade}
            onMouseEnter={(e) => showTooltip(e, "Add Row")}
            onMouseLeave={hideTooltip}
          >
            <Rows3 size={15} />
          </Button.Icon>

          <Button.Icon
            onClick={onAddColumn}
            onMouseEnter={(e) => showTooltip(e, "Add Column")}
            onMouseLeave={hideTooltip}
          >
            <Columns3 size={15} />
          </Button.Icon>
        </div>

        {/* SECONDARY */}
        <div className="flex items-center gap-1 opacity-90">
          <Button.Icon
            className={isFilterApplied ? "bg-(--hover)!" : ""}
            onClick={onFilter}
            onMouseEnter={(e) => showTooltip(e, "Filter")}
            onMouseLeave={hideTooltip}
          >
            <Filter size={15} />
          </Button.Icon>

          <Button.Icon
            className={isSortingApplied ? "bg-(--hover)!" : ""}
            onClick={onSort}
            onMouseEnter={(e) => showTooltip(e, "Sort")}
            onMouseLeave={hideTooltip}
          >
            <ArrowUpDown size={15} />
          </Button.Icon>

          <Button.Icon
            className={isGroupingApplied ? "bg-(--hover)!" : ""}
            onClick={onGroup}
            onMouseEnter={(e) => showTooltip(e, "Group")}
            onMouseLeave={hideTooltip}
          >
            <Group size={15} />
          </Button.Icon>
        </div>

        {/* VIEW */}
        <div className="flex items-center gap-1 opacity-80">
          <Button.Icon
            onClick={onToggleSummary}
            onMouseEnter={(e) => showTooltip(e, "Trade Summary")}
            onMouseLeave={hideTooltip}
          >
            <LayoutGrid size={15} />
          </Button.Icon>

          <Button.Icon
            onClick={onToggleHeatmap}
            onMouseEnter={(e) => showTooltip(e, "HeatMap")}
            onMouseLeave={hideTooltip}
          >
            <Flame size={15} />
          </Button.Icon>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        {/* STATUS */}
        <div className="flex items-center gap-2 text-xs text-(--text-muted)">
          {isSaving || isSavingLayout ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Saving..</span>
            </>
          ) : pending > 0 ? (
            <>
              <span className="w-2 h-2 rounded-full bg-(--warning)" />
              <span>{pending} pending</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={13} className="text-(--success)" />
              <span>Saved</span>
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-1 opacity-90">
          <Button.Icon
            onClick={onOpenColumnSettings}
            onMouseEnter={(e) => showTooltip(e, "Column Settings")}
            onMouseLeave={hideTooltip}
          >
            <ColumnsSettings size={15} />
          </Button.Icon>

          <Button.Icon
            onClick={onResetLayout}
            onMouseEnter={(e) => showTooltip(e, "Reset Column Order")}
            onMouseLeave={hideTooltip}
          >
            <RotateCcw size={15} />
          </Button.Icon>

          <Button.Icon
            onClick={onExport}
            onMouseEnter={(e) => showTooltip(e, "Export Trades")}
            onMouseLeave={hideTooltip}
          >
            <Download size={15} />
          </Button.Icon>
        </div>

        {/* <ColumnInspector /> */}
      </div>
    </div>
  );
}
