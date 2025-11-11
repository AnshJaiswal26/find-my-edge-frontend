import { useState } from "react";
import { useChartStore } from "@stores";
import CartesianLayoutPopup from "./cartesian/CartesianLayoutPopup";
import RadialLayoutPopup from "./radialbar/RadialLayoutPoup";
import PieLayoutPopup from "./pie/PieLayoutPopup";
import RadarLayoutPopup from "./radar/RadarLayoutPopup";
import { Popup } from "@layout";
import styles from "./LayoutPopup.module.css";
import PolarAreaLayoutPopup from "./polarArea/PolarAreaLayoutPopup";

export default function ChartLayoutPopup() {
  const activeChart = useChartStore((s) => s.activeChart);
  const updateChart = useChartStore((s) => s.updateChart);
  const [isAnyChange, setIsAnyChange] = useState(true);

  if (activeChart.id === "") return null;

  const handleClose = () => {
    updateChart(activeChart.id, (chart, s) => {
      s.activeChart.id = "";
      chart.draft.layout = chart.live.layout;
      chart.draft.seriesConfig = chart.live.seriesConfig;
    });
    document.body.style.overflow = "";
  };

  const handleApply = () => {
    updateChart(activeChart.id, (chart, s) => {
      s.activeChart.id = "";
      chart.live.layout = chart.draft.layout;
      chart.live.seriesConfig = chart.draft.seriesConfig;
    });
    document.body.style.overflow = "";
  };

  return (
    <Popup
      title={"Layout"}
      isVisible={true}
      text={["Cancel", isAnyChange ? "Apply" : "Ok"]}
      onCancel={handleClose}
      onApply={handleApply}
      onClose={handleClose}
    >
      <div className={styles.contentWrapper}>
        <PopupContent
          id={activeChart.id}
          type={activeChart.type}
          updateChart={updateChart}
        />
      </div>
    </Popup>
  );
}

function PopupContent({ id, type, updateChart }) {
  switch (type) {
    case "radialBar":
      return <RadialLayoutPopup chartId={id} updateChart={updateChart} />;

    case "donut":
      return <PieLayoutPopup chartId={id} updateChart={updateChart} />;

    case "radar":
      return <RadarLayoutPopup chartId={id} updateChart={updateChart} />;

    case "polarArea":
      return <PolarAreaLayoutPopup chartId={id} updateChart={updateChart} />;

    default:
      return (
        <CartesianLayoutPopup
          chartId={id}
          type={type}
          updateChart={updateChart}
        />
      );
  }
}
