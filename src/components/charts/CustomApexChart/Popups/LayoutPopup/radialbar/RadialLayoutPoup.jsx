import { useCallback, useState } from "react";
import { Popup, Section } from "@layout";
import { ToggleButton, InputField, ColorPicker } from "@ui";
import { useChartStore } from "@stores";
import { parseColor } from "@utils";
import styles from "../ChartLayoutPopup.module.css";

// --- Sub-sections ---
import RadialGeneralSection from "./sections/GeneralSection";
import RadialDataLabelSection from "./sections/DataLabelsSection";
import RadialTrackSection from "./sections/TrackSection";
import RadialLegendSection from "./sections/LegendSection";

export default function RadialLayoutPopup({ chartId }) {
  const updateChart = useChartStore((s) => s.updateChart);
  const chart = useChartStore((s) => s[chartId]);
  const [isAnyChange, setIsAnyChange] = useState(true);

  const handleClose = useCallback(() => {
    updateChart(chartId, (chart, s) => {
      s.activeChart.id = "";
      chart.draft.layout = chart.live.layout;
      chart.draft.seriesConfig = chart.live.seriesConfig;
    });
    document.body.style.overflow = "";
  }, []);

  const handleApply = useCallback(() => {
    updateChart(chartId, (chart, s) => {
      s.activeChart.id = "";
      chart.live.layout = chart.draft.layout;
      chart.live.seriesConfig = chart.draft.seriesConfig;
    });
    document.body.style.overflow = "";
  }, []);

  return (
    <Popup
      title="Layout"
      isVisible={true}
      text={{ leftBtn: "Cancel", rightBtn: isAnyChange ? "Apply" : "Ok" }}
      onLeftBtnClick={handleClose}
      onRightBtnClick={handleApply}
      onClose={handleClose}
    >
      <div className={styles.contentWrapper}>
        <RadialGeneralSection chartId={chartId} updateChart={updateChart} />
        <RadialTrackSection chartId={chartId} updateChart={updateChart} />
        <RadialDataLabelSection chartId={chartId} updateChart={updateChart} />
        <RadialLegendSection chartId={chartId} updateChart={updateChart} />
      </div>
    </Popup>
  );
}
