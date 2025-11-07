import { useState } from "react";
import { Popup } from "@layout";
import { useChartStore } from "@stores";
import styles from "../LayoutPopup.module.css";

// --- Sub-sections ---
import GeneralSection from "./sections/GeneralSection";
import DataLabelSection from "./sections/DataLabelsSection";
import PieSliceSection from "./sections/PieSliceSection";
import LegendSection from "../common sections/LegendSection";

export default function PieLayoutPopup({ chartId }) {
  const updateChart = useChartStore((s) => s.updateChart);
  const [isAnyChange, setIsAnyChange] = useState(true);

  const handleClose = () => {
    updateChart(chartId, (chart, s) => {
      s.activeChart.id = "";
      chart.draft.layout = chart.live.layout;
      chart.draft.seriesConfig = chart.live.seriesConfig;
    });
    document.body.style.overflow = "";
  };

  const handleApply = () => {
    updateChart(chartId, (chart, s) => {
      s.activeChart.id = "";
      chart.live.layout = chart.draft.layout;
      chart.live.seriesConfig = chart.draft.seriesConfig;
    });
    document.body.style.overflow = "";
  };

  return (
    <Popup
      title="Layout"
      isVisible={true}
      text={["Cancel", isAnyChange ? "Apply" : "Ok"]}
      onCancel={handleClose}
      onApply={handleApply}
      onClose={handleClose}
    >
      <div className={styles.contentWrapper}>
        <GeneralSection chartId={chartId} updateChart={updateChart} />
        <PieSliceSection chartId={chartId} updateChart={updateChart} />
        <DataLabelSection chartId={chartId} updateChart={updateChart} />
        <LegendSection chartId={chartId} updateChart={updateChart} />
      </div>
    </Popup>
  );
}
