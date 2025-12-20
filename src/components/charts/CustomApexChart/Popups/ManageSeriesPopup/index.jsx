import { Popup } from "@layout";
import styles from "./ManageSeriesPopup.module.css";
import { tradeData } from "@data";
import { useChartStore } from "@stores";
import { useState } from "react";
import { IconButton } from "@ui";
import { Plus, Trash2 } from "lucide-react";

const seriesCfgGenerator = {
  bar: (key) => ({
    key,
    name: key,
    colors: [
      {
        from: 0,
        to: Number.MAX_SAFE_INTEGER,
        color: "var(--info)",
        tooltipLabel: key,
      },
    ],
  }),
  line: (key) => ({
    key,
    name: key,
    tooltipLabel: key,
    color: "var(--info)",
    markerColor: "var(--info)",
    areaColor: "var(--info)",
  }),
};

function MetricsSection({
  title,
  list = [],
  icon,
  onClick,
  disable = false,
  color = "default",
  className = "selectedMetricsList",
}) {
  return (
    <div className={styles.section}>
      <div className="pl-1">
        <span>{title}</span>
      </div>
      <div className={styles[className]}>
        {list.length === 0 ? (
          <div className="self-center text-[var(--text-disabled)]">
            No Selected Metrics
          </div>
        ) : (
          list.map((key, index) => (
            <div
              key={index}
              className={`${styles.listRow} ${disable ? styles.disable : ""}`}
            >
              <div style={{ color: `var(--color-${color})` }}>
                <span>{key}</span>
              </div>
              <IconButton
                icon={icon}
                className={"p-1"}
                onClick={() => onClick(key)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ManageSeriesPopup({ chartId, type, updateChart }) {
  const seriesConfig = useChartStore((s) => s[chartId].draft.seriesConfig);
  const currentSeries = seriesConfig.map((cfg) => cfg.key);

  const [selected, setSelected] = useState([]);

  const availableMetrics = Object.keys(tradeData[0]).filter(
    (k) => !currentSeries.includes(k) && !selected.includes(k)
  );

  const handleClose = () => {
    updateChart(chartId, (chart, s) => {
      s.activeChart.activePopup = null;
      chart.draft.seriesConfig = chart.live.seriesConfig;
    });
    document.body.style.overflow = "";
  };

  const handleApply = () => {
    updateChart(chartId, (chart, s) => {
      const selectedMetrics = selected.map((k) => seriesCfgGenerator[type](k));
      s.activeChart.activePopup = null;
      chart.live.seriesConfig = [
        ...chart.draft.seriesConfig,
        ...selectedMetrics,
      ];
      chart.draft.seriesConfig = [
        ...chart.draft.seriesConfig,
        ...selectedMetrics,
      ];
    });
    document.body.style.overflow = "";
  };

  return (
    <Popup
      title={"Manage Series"}
      isVisible={true}
      text={["Cancel", "Apply"]}
      onCancel={handleClose}
      onApply={handleApply}
      onClose={handleClose}
    >
      <div className={styles.contentWrapper}>
        <div className="text-[var(--error)] text-[0.8rem]">
          <strong>Note:</strong> You can have up to 3 active series at a time,
          and at least 1 must remain active.
        </div>
        <div className="flex gap-3">
          <MetricsSection
            title={"Available Metrics"}
            list={availableMetrics}
            icon={<Plus />}
            disable={selected.length + currentSeries.length > 2}
            onClick={(k) => setSelected((p) => [...p, k])}
            className="availableMetricsList"
          />
          <div className={styles.section}>
            <MetricsSection
              title={"Active Metrics"}
              list={currentSeries}
              icon={<Trash2 />}
              onClick={(k) =>
                updateChart(chartId, (chart) => {
                  const cfg = chart.draft.seriesConfig;
                  chart.draft.seriesConfig = cfg.filter((s) => k !== s.key);
                })
              }
              disable={currentSeries.length < 2}
              color="green"
              className="activeMetricsList"
            />
            <MetricsSection
              title={"Selected Metrics"}
              list={selected}
              icon={<Trash2 />}
              onClick={(k) => setSelected((p) => p.filter((i) => i !== k))}
              color="yellow"
              className="selectedMetricsList"
            />
          </div>
        </div>
      </div>
    </Popup>
  );
}
