import { ChartViewport } from "./ChartViewport";

export function ChartViewportWrapper(props) {
  const { chartWidth } = props.layout;
  const isZoomedIn = chartWidth === 100 || typeof chartWidth === "string";

  return (
    <div
      data-chart-type={props.type}
      style={{
        overflowX: isZoomedIn ? "" : "auto",
        overflowY: !isZoomedIn ? "hidden" : "",
      }}
      className={"relative h-full w-full"}
    >
      <div className="h-full relative" style={{ width: `${chartWidth}%` }}>
        <ChartViewport {...props} />
      </div>
    </div>
  );
}
