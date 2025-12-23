import {
  Plus,
  Filter,
  ArrowUpDown,
  Sigma,
  Flame,
  Settings,
  Download,
  RotateCcw,
  LayoutGrid,
  ColumnsSettings,
  Trash2,
} from "lucide-react";
import { Button } from "@ui";
import { useTableStore } from "../store";
import { Divider } from "@layout";

export function Toolbar({
  onAddTrade,
  onAddMetric,
  onFilter,
  onSort,
  onDelete,
  onToggleSummary,
  onToggleHeatmap,
  onResetLayout,
  onExport,
  onOpenColumnSettings,
}) {
  const filteredRowOrder = useTableStore((s) => s.filteredRowOrder);
  return (
    <div
      className="
        flex items-center justify-start
        px-8 py-2 gap-10
        border border-(--border)
        bg-(--surface-muted)
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-1">
        <Button.Icon
          disabled={filteredRowOrder.length > 0}
          tooltip={{ text: "Add Trade", position: "bottom" }}
          onClick={onAddTrade}
        >
          <ColumnsSettings size={16} className="text-inherit" />
        </Button.Icon>

        <Button.Icon
          className={filteredRowOrder.length > 0 ? "bg-(--hover)!" : ""}
          tooltip={{ text: "Filter Trades", position: "bottom" }}
          onClick={onFilter}
        >
          <Filter size={16} className="text-inherit" />
        </Button.Icon>

        <Button.Icon
          tooltip={{ text: "Sort", position: "bottom" }}
          onClick={onSort}
        >
          <ArrowUpDown size={16} className="text-inherit" />
        </Button.Icon>

        <Button.Icon
          tooltip={{ text: "Sort", position: "bottom" }}
          onClick={onDelete}
        >
          <Trash2 size={16} className="text-inherit" />
        </Button.Icon>
      </div>

      <Divider vertical />

      {/* CENTER */}
      <div className="flex items-center gap-1">
        <Button.Icon
          tooltip={{ text: "Add Metric", position: "bottom" }}
          onClick={onAddMetric}
        >
          <Sigma size={16} className="text-inherit" />
        </Button.Icon>

        <Button.Icon
          tooltip={{ text: "Summary View", position: "bottom" }}
          onClick={onToggleSummary}
        >
          <LayoutGrid size={16} className="text-inherit" />
        </Button.Icon>

        <Button.Icon
          tooltip={{ text: "Heatmap", position: "bottom" }}
          onClick={onToggleHeatmap}
        >
          <Flame size={16} className="text-inherit" />
        </Button.Icon>
      </div>

      <Divider vertical />

      {/* RIGHT */}
      <div className="flex items-center gap-1">
        <Button.Icon
          tooltip={{ text: "Column Settings", position: "bottom" }}
          onClick={onOpenColumnSettings}
        >
          <ColumnsSettings size={16} className="text-inherit" />
        </Button.Icon>

        <Button.Icon
          tooltip={{ text: "Reset Layout", position: "bottom" }}
          onClick={onResetLayout}
        >
          <RotateCcw size={16} className="text-inherit" />
        </Button.Icon>

        <Button.Icon
          tooltip={{ text: "Export Data", position: "bottom" }}
          onClick={onExport}
        >
          <Download size={16} className="text-inherit" />
        </Button.Icon>
      </div>
    </div>
  );
}
