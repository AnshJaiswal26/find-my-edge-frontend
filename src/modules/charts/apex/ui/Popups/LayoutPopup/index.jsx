import { useCallback, useState } from "react";
import { Popup } from "@shared/components/layout";

import CartesianLayoutPopup from "./cartesian/CartesianLayoutPopup";
import RadialLayoutPopup from "./radialbar/RadialLayoutPoup";
import PieLayoutPopup from "./pie/PieLayoutPopup";
import RadarLayoutPopup from "./radar/RadarLayoutPopup";
import PolarAreaLayoutPopup from "./polarArea/PolarAreaLayoutPopup";
import { useChartStore } from "@modules/charts/apex/store";

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
  const state = useChartStore.getState();
  const { closePopup, updateLayout } = state;

  const chart = state.charts[chartId];

  const type = chart.meta.type;

  const [layoutDraft, setLayoutDraft] = useState({ ...chart.layout });
  const [seriesDraft, setSeriesDraft] = useState([
    ...(chart?.ySeriesConfig ?? chart.seriesConfig),
  ]);

  const updateSeries = useCallback(
    (index, patch) => {
      setSeriesDraft((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], ...patch };
        return next;
      });
    },
    [setSeriesDraft],
  );

  return (
    <Popup open={true}>
      <Popup.Container className="max-w-130!">
        {/* Header */}
        <Popup.Header title="Layout" onClose={closePopup} />

        {/* Body */}
        <Popup.Body>
          <PopupContent
            chartId={chartId}
            chart={chart}
            type={type}
            layoutDraft={layoutDraft}
            seriesDraft={seriesDraft}
            setLayoutDraft={setLayoutDraft}
            setSeriesDraft={setSeriesDraft}
            updateSeries={updateSeries}
          />
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
