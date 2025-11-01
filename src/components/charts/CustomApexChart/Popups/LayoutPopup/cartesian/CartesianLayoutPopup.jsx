import { useCallback, useState } from "react";
import { ToggleButton } from "@ui";
import { Popup, Section } from "@layout";
import { useChartStore } from "@stores";
import styles from "./CartesianLayoutPopup.module.css";

import {
  GeneralSection,
  XAxisSection,
  YAxisSection,
  BarSettingsSection,
  LineSettingsSection,
} from "./sections";

export default function CartesianLayoutPopup({ chartId, type = "bar" }) {
  const state = useChartStore.getState();
  const chart = state.charts[chartId];
  const isHorizontal = chart.layout.horizontal;

  const [isAnyChange, setIsAnyChange] = useState(true);

  const handleClose = useCallback(() => {
    updateChart(chartId, (chart, s) => {
      s.charts.activeChart.id = "";
      chart.tempLayout = chart.layout;
      chart.tempSeriesConfig = chart.seriesConfig;
    });
    document.body.style.overflow = "";
  }, []);

  const handleApply = useCallback(() => {
    updateChart(chartId, (chart, s) => {
      s.charts.activeChart.id = "";
      chart.layout = chart.tempLayout;
      chart.seriesConfig = chart.tempSeriesConfig;
    });
    document.body.style.overflow = "";
  }, []);

  const updateChart = useChartStore((s) => s.updateChart);

  return (
    <Popup
      title={"Layout"}
      isVisible={true}
      text={{ leftBtn: "Cancel", rightBtn: isAnyChange ? "Apply" : "Ok" }}
      onLeftBtnClick={handleClose}
      onRightBtnClick={handleApply}
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
              value={(s) => s.charts[chartId].tempLayout[key]}
              onClick={() =>
                updateChart(chartId, (chart) => {
                  chart.tempLayout[key] = !chart.tempLayout[key];
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
      </div>
    </Popup>
  );
}
