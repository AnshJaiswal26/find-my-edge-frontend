import { useDashboardStore } from "@features/dashboard/store";
import StatCard from "../ui/StatCard";
import { useGridStackWidget } from "@shared/hooks";
import { useRef } from "react";

export default function StatGridItem({ id }) {
  const ref = useRef(null);
  const savedLayout = useDashboardStore((s) => s.gridLayout?.[`stat-${id}`]);

  useGridStackWidget(ref);

  return (
    <div
      ref={ref}
      className="grid-stack-item"
      gs-id={id}
      gs-x={savedLayout?.x}
      gs-y={savedLayout?.y}
      gs-w={savedLayout?.w ?? 7}
      gs-h={savedLayout?.h ?? 4}
      gs-min-w={6}
      gs-min-h={4}
    >
      <div className="grid-stack-item-content !overflow-visible">
        <div className="h-full relative">
          <StatCard statId={id} />
        </div>
      </div>
    </div>
  );
}
