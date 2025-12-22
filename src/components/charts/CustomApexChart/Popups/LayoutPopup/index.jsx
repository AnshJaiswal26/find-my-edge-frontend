import { useState } from "react";
import CartesianLayoutPopup from "./cartesian/CartesianLayoutPopup";
import RadialLayoutPopup from "./radialbar/RadialLayoutPoup";
import PieLayoutPopup from "./pie/PieLayoutPopup";
import RadarLayoutPopup from "./radar/RadarLayoutPopup";
import { Popup } from "@layout";
import styles from "./LayoutPopup.module.css";
import PolarAreaLayoutPopup from "./polarArea/PolarAreaLayoutPopup";

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

export default function ChartLayoutPopup({ chartId, type, updateChart }) {
  const [isAnyChange, setIsAnyChange] = useState(true);

  const handleClose = () => {
    updateChart(chartId, (chart, s) => {
      s.activeChart.activePopup = null;
      chart.draft.layout = chart.live.layout;
      chart.draft.seriesConfig = chart.live.seriesConfig;
    });
    document.body.style.overflow = "";
  };

  const handleApply = () => {
    updateChart(chartId, (chart, s) => {
      s.activeChart.activePopup = null;
      chart.live.layout = chart.draft.layout;
      chart.live.seriesConfig = chart.draft.seriesConfig;
    });
    document.body.style.overflow = "";
  };

  return (
    <Popup open={true}>
      <Popup.Container>
        {/* Header */}
        <Popup.Header title="Layout" onClose={handleClose} />

        {/* Body */}
        <Popup.Body>
          <div className={styles.contentWrapper}>
            <PopupContent id={chartId} type={type} updateChart={updateChart} />
          </div>
        </Popup.Body>

        {/* Footer */}
        <Popup.Footer
          text={["Cancel", isAnyChange ? "Apply" : "Ok"]}
          onCancel={handleClose}
          onApply={handleApply}
        />
      </Popup.Container>
    </Popup>
  );
}
