import { useCallback, useState } from "react";
import { Popup, Section } from "@layout";
import { ToggleButton, InputField, ColorPicker } from "@ui";
import { useChartStore } from "@stores";
import { parseColor } from "@utils";
import styles from "../LayoutPopup.module.css";

// --- Sub-sections ---
import GeneralSection from "./sections/GeneralSection";
import DataLabelSection from "./sections/DataLabelsSection";
import TrackSection from "./sections/TrackSection";
import BarSection from "./sections/RadialBarSection";
import LegendSection from "./sections/LegendSection";

export default function RadialLayoutPopup({ chartId }) {
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
        <TrackSection chartId={chartId} updateChart={updateChart} />
        <BarSection chartId={chartId} updateChart={updateChart} />
        <DataLabelSection chartId={chartId} updateChart={updateChart} />
        <LegendSection chartId={chartId} updateChart={updateChart} />
      </div>
    </Popup>
  );
}
