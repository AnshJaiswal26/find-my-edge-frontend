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

  const updateLayout = state.updateLayout;
  const updateSeriesConfigMerge = state.updateSeriesConfigMerge;
  const updateActiveChart = state.updateActiveChart;

  const isHorizontal = chart.layout.horizontal;

  const [isAnyChange, setIsAnyChange] = useState(true);

  const handlePopupClose = useCallback((key) => {
    updateChart(chartId, {
      [key]: (p, chart) => chart[key === "layout" ? "tempLayout" : "layout"],
      [key === "layout" ? "seriesColor" : "tempSeriesColor"]: (p, chart) =>
        key === "layout" ? chart.tempSeriesColor : chart.seriesColor,
    });
    document.body.style.overflow = "";
    updateActiveChart({ id: "" });
  }, []);

  const handleApply = () => {
    updateChart(chartId, {
      seriesColors: (_, c) => c.tempSeriesColors,
      layout: (_, c) => c.tempLayout,
    });
    document.body.style.overflow = "";
    updateActiveChart({ id: "" });
  };

  const updateChart = useChartStore((s) => s.updateChart);

  return (
    <Popup
      title={"Layout"}
      isVisible={true}
      text={{ leftBtn: "Cancel", rightBtn: isAnyChange ? "Apply" : "Ok" }}
      onLeftBtnClick={() => handlePopupClose("tempLayout")}
      onRightBtnClick={handleApply}
      onClose={() => handlePopupClose("tempLayout")}
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
              onClick={() => {
                updateChart(chartId, {
                  tempLayout: (p) => ({ [key]: !p[key] }),
                });
              }}
              store={useChartStore}
            />
          ))}
        </Section>

        {type === "line" ? (
          <LineSettingsSection
            chartId={chartId}
            updateChart={updateChart}
            tempLayout={chart.tempLayout}
          />
        ) : type === "bar" ? (
          <BarSettingsSection chartId={chartId} updateChart={updateChart} />
        ) : null}

        <XAxisSection
          chartId={chartId}
          updateLayout={updateLayout}
          isHorizontal={isHorizontal}
        />

        <YAxisSection
          chartId={chartId}
          updateLayout={updateLayout}
          isHorizontal={isHorizontal}
        />
      </div>
    </Popup>
  );
}
