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
  const updateLayout = useChartStore((s) => s.updateLayout);
  const updateSeriesConfigMerge = useChartStore(
    (s) => s.updateSeriesConfigMerge
  );
  const updateActiveChart = useChartStore((s) => s.updateActiveChart);
  const [isAnyChange, setIsAnyChange] = useState(true);

  const handlePopupClose = useCallback((key) => {
    const chart = useChartStore.getState().charts[chartId];
    updateLayout(chartId, key ? chart.layout : chart.tempLayout, key);
    updateSeriesConfigMerge(chartId, key ? "reset" : "merge");
    document.body.style.overflow = "";
    updateActiveChart({ id: "" });
  }, []);

  const isHorizontal =
    useChartStore.getState().charts[chartId].layout.horizontal;

  return (
    <Popup
      title={"Layout"}
      isVisible={true}
      text={{ leftBtn: "Cancel", rightBtn: isAnyChange ? "Apply" : "Ok" }}
      onLeftBtnClick={() => handlePopupClose("tempLayout")}
      onRightBtnClick={handlePopupClose}
      onClose={() => handlePopupClose("tempLayout")}
    >
      <div className={styles.contentWrapper}>
        <GeneralSection chartId={chartId} updateLayout={updateLayout} />
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
                const current =
                  useChartStore.getState().charts[chartId].tempLayout[key];
                updateLayout(chartId, { [key]: !current }, "tempLayout");
              }}
              store={useChartStore}
            />
          ))}
        </Section>

        {type === "line" ? (
          <LineSettingsSection chartId={chartId} updateLayout={updateLayout} />
        ) : type === "bar" ? (
          <BarSettingsSection chartId={chartId} updateLayout={updateLayout} />
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
