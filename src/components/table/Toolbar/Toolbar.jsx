import {
  Plus,
  Filter,
  Calendar,
  ArrowUpDown,
  Sigma,
  Brain,
  Flame,
  Settings,
  Download,
  RotateCcw,
  LayoutGrid,
} from "lucide-react";
import { ToolbarButton } from "./ToolbarButton";

export function Toolbar({
  onAddTrade,
  onAddMetric,
  onToggleSummary,
  onToggleReview,
  onToggleHeatmap,
  onResetLayout,
  onExport,
  onOpenColumnSettings,
}) {
  return (
    <div
      className="
        flex items-center justify-between
        px-3 py-2 gap-4
        border border-(--border)
        bg-(--surface-muted)
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Plus}
          tooltip="Add Trade"
          onClick={onAddTrade}
          primary
        />
        <ToolbarButton icon={Calendar} tooltip="Date Filter" />
        <ToolbarButton icon={Filter} tooltip="Filter Trades" />
        <ToolbarButton icon={ArrowUpDown} tooltip="Sort" />
      </div>

      {/* CENTER */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Sigma}
          tooltip="Add Metric"
          onClick={onAddMetric}
        />
        <ToolbarButton
          icon={LayoutGrid}
          tooltip="Summary View"
          onClick={onToggleSummary}
        />
        <ToolbarButton
          icon={Brain}
          tooltip="Trade Review"
          onClick={onToggleReview}
        />
        <ToolbarButton
          icon={Flame}
          tooltip="Heatmap"
          onClick={onToggleHeatmap}
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Settings}
          tooltip="Column Settings"
          onClick={onOpenColumnSettings}
        />
        <ToolbarButton
          icon={RotateCcw}
          tooltip="Reset Layout"
          onClick={onResetLayout}
        />
        <ToolbarButton
          icon={Download}
          tooltip="Export Data"
          onClick={onExport}
        />
      </div>
    </div>
  );
}
