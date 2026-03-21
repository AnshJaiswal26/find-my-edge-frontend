import { useChartStore } from "@modules/charts/apex/store";

export function ChartTitle({ chartId }) {
  const title = useChartStore((s) => s.charts[chartId].layout.title);

  return (
    <div className="flex items-center h-fit justify-between flex-wrap font-bold">
      <span>{title}</span>
    </div>
  );
}
