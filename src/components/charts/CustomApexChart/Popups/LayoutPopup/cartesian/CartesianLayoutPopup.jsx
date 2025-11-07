import { useState } from "react";
import { Select, ToggleButton } from "@ui";
import { Popup, Section } from "@layout";
import { useChartStore } from "@stores";
import styles from "../LayoutPopup.module.css";

import {
  GeneralSection,
  XAxisSection,
  YAxisSection,
  BarSettingsSection,
  LineSettingsSection,
} from "./sections";
import LegendSection from "../common sections/LegendSection";

export default function CartesianLayoutPopup({ chartId, type = "bar" }) {
  const state = useChartStore.getState();
  const chart = state[chartId];
  const isHorizontal = chart.live.layout.horizontal;

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

  const updateChart = useChartStore((s) => s.updateChart);

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
        <GeneralSection chartId={chartId} updateChart={updateChart} />
        <Section title="Grid">
          {[
            { title: "X Grid", key: "xGrid" },
            { title: "Y Grid", key: "yGrid" },
          ].map(({ title, key }, i) => (
            <ToggleButton
              key={i}
              label={title}
              value={(s) => s[chartId].draft.layout[key]}
              onClick={() =>
                updateChart(chartId, (chart) => {
                  chart.draft.layout[key] = !chart.draft.layout[key];
                })
              }
              store={useChartStore}
            />
          ))}
        </Section>

        {type === "line" ? (
          <LineSettingsSection
            chartId={chartId}
            updateChart={updateChart}
            chart={chart}
          />
        ) : type === "bar" ? (
          <BarSettingsSection chartId={chartId} updateChart={updateChart} />
        ) : null}

        <XAxisSection
          chartId={chartId}
          updateChart={updateChart}
          isHorizontal={isHorizontal}
        />

        <YAxisSection
          chartId={chartId}
          updateChart={updateChart}
          isHorizontal={isHorizontal}
        />

        <LegendSection chartId={chartId} updateChart={updateChart} />
      </div>
    </Popup>
  );
}
