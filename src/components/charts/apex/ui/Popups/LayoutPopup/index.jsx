import { useState } from "react";
import CartesianLayoutPopup from "./cartesian/CartesianLayoutPopup";
import RadialLayoutPopup from "./radialbar/RadialLayoutPoup";
import PieLayoutPopup from "./pie/PieLayoutPopup";
import RadarLayoutPopup from "./radar/RadarLayoutPopup";
import { Popup } from "@layout";
import styles from "./LayoutPopup.module.css";
import PolarAreaLayoutPopup from "./polarArea/PolarAreaLayoutPopup";
import { useChartStore } from "@stores";

function PopupContent(props) {
  switch (props.type) {
    case "radialBar":
      return <RadialLayoutPopup {...props} />;

    case "donut":
      return <PieLayoutPopup {...props} />;

    case "radar":
      return <RadarLayoutPopup {...props} />;

    case "polarArea":
      return <PolarAreaLayoutPopup {...props} />;

    default:
      return <CartesianLayoutPopup {...props} />;
  }
}

export default function ChartLayoutPopup({ chartId, type, updateChart }) {
  const chart = useChartStore.getState()[chartId];

  const [layoutDraft, setLayoutDraft] = useState({ ...chart.layout });
  const [seriesDraft, setSeriesDraft] = useState([...chart.seriesConfig]);

  const handleClose = () => {
    updateChart(chartId, (_, s) => {
      s.activeChart.activePopup = null;
    });
    document.body.style.overflow = "";
  };

  const handleApply = () => {
    updateChart(chartId, (chart, s) => {
      s.activeChart.activePopup = null;
      chart.layout = layoutDraft;
      chart.seriesConfig = seriesDraft;
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
            <PopupContent
              chartId={chartId}
              type={type}
              layoutDraft={layoutDraft}
              seriesDraft={seriesDraft}
              setLayoutDraft={setLayoutDraft}
              setSeriesDraft={setSeriesDraft}
            />
          </div>
        </Popup.Body>

        {/* Footer */}
        <Popup.Footer
          text={["Cancel", "Apply"]}
          onCancel={handleClose}
          onApply={handleApply}
        />
      </Popup.Container>
    </Popup>
  );
}
