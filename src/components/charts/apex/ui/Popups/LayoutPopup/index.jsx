import { useState } from "react";
import CartesianLayoutPopup from "./cartesian/CartesianLayoutPopup";
import RadialLayoutPopup from "./radialbar/RadialLayoutPoup";
import PieLayoutPopup from "./pie/PieLayoutPopup";
import RadarLayoutPopup from "./radar/RadarLayoutPopup";
import { Popup } from "@layout";
import styles from "./LayoutPopup.module.css";
import PolarAreaLayoutPopup from "./polarArea/PolarAreaLayoutPopup";
import { useChartStore } from "@charts/apex/store/useChartStore";

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

export default function ChartLayoutPopup({ chartId }) {
  const {
    closePopup,
    updateLayout,
    [chartId]: chart,
  } = useChartStore.getState();

  const type = chart.meta.type;

  const [layoutDraft, setLayoutDraft] = useState({ ...chart.layout });
  const [seriesDraft, setSeriesDraft] = useState([...chart.seriesConfig]);

  return (
    <Popup open={true}>
      <Popup.Container>
        {/* Header */}
        <Popup.Header title="Layout" onClose={closePopup} />

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
          onCancel={closePopup}
          onApply={() => updateLayout(chartId, layoutDraft, seriesDraft)}
        />
      </Popup.Container>
    </Popup>
  );
}
