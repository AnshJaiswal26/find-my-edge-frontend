// components/TableToolbar.jsx
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
      className="flex flex-wrap items-center justify-between gap-4 
                px-3 py-2 
                border border-(--border) 
                bg-(--surface-muted) 
                sticky top-0 z-10"
    >
      {/* LEFT: Core actions */}
      <div className="flex items-center gap-2">
        <ToolbarButton icon={Plus} label="Trade" onClick={onAddTrade} primary />
        <ToolbarButton icon={Calendar} label="Date" />
        <ToolbarButton icon={Filter} label="Filter" />
        <ToolbarButton icon={ArrowUpDown} label="Sort" />
      </div>

      {/* CENTER: Metrics & analysis */}
      <div className="flex items-center gap-2">
        <ToolbarButton icon={Sigma} label="Add Metric" onClick={onAddMetric} />
        <ToolbarButton
          icon={LayoutGrid}
          label="Summary"
          onClick={onToggleSummary}
        />
        <ToolbarButton icon={Brain} label="Review" onClick={onToggleReview} />
        <ToolbarButton icon={Flame} label="Heatmap" onClick={onToggleHeatmap} />
      </div>

      {/* RIGHT: Layout & export */}
      <div className="flex items-center gap-2">
        <ToolbarButton
          icon={Settings}
          label="Columns"
          onClick={onOpenColumnSettings}
        />
        <ToolbarButton icon={RotateCcw} label="Reset" onClick={onResetLayout} />
        <ToolbarButton icon={Download} label="Export" onClick={onExport} />
      </div>
    </div>
  );
}
