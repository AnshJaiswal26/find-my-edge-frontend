import {
  Filter,
  ArrowUpDown,
  Flame,
  Download,
  RotateCcw,
  LayoutGrid,
  ColumnsSettings,
  Rows3,
  Columns3,
  Group,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@ui";
import { Divider } from "@layout";
import { useTableStore } from "@table/store/useTableStore";
import { ColumnInspector } from "../Column/ColumnInspector";
import { useTradeStore } from "@stores";

const SavingStatus = () => {
  const isSaving = useTradeStore((s) => s.isSaving);
  const pendingUpdates = useTradeStore((s) => s.pendingUpdates);

  const pending = Object.keys(pendingUpdates).length;
  return (
    <div className="flex items-center gap-2 text-xs text-(--text-muted)">
      {isSaving ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span>Saving…</span>
        </>
      ) : pending > 0 ? (
        <>
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>Unsaved changes</span>
        </>
      ) : (
        <>
          <CheckCircle2 size={14} className="text-green-500" />
          <span>All changes saved</span>
        </>
      )}
    </div>
  );
};

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
              tooltip={{ text: "Add Row", position: "bottom" }}
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
              tooltip={{ text: "Filter", position: "bottom" }}
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
              className={isGroupingApplied ? "bg-(--hover)!" : ""}
              tooltip={{ text: "Group", position: "bottom" }}
              onClick={onGroup}
            >
              <Group size={16} />
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

        <div className="flex items-center justify-end gap-3 min-w-[260px]">
          {/*  SAVE STATUS */}
          <SavingStatus />

          {/* INSPECTOR */}
          <ColumnInspector />
        </div>
      </div>
    </div>
  );
}
